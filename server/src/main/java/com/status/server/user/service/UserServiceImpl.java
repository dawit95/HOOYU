package com.status.server.user.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.status.server.content.domain.*;
import com.status.server.content.dto.RequestContentTimeDto;
import com.status.server.content.service.ContentServiceImpl;
import com.status.server.emotion.domain.EmotionRepository;
import com.status.server.fcm.domain.FcmToken;
import com.status.server.fcm.domain.FcmTokenRepository;
import com.status.server.fcm.service.FcmService;
import com.status.server.global.domain.Token;
import com.status.server.global.dto.DistDto;
import com.status.server.global.exception.*;
import com.status.server.global.service.TokenService;
import com.status.server.global.util.RadarMath;
import com.status.server.user.domain.*;
import com.status.server.user.dto.ResponsePrivateZoneDto;
import com.status.server.user.dto.ResponseUserLocationDto;
import com.status.server.user.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PrivateZoneRepository pzRepository;
    private final LocationRepository locationRepository;
    private final FcmTokenRepository fcmTokenRepository;
    private final RecordTimeRepository recordTimeRepository;

    private final ReportedContentRepository reportedContentRepository;
    private final EmotionRepository emotionRepository;
    private final SurveyContentAnswerRepository surveyContentAnswerRepository;
    private final ContentRepository contentRepository;
    private final ContentServiceImpl contentService;

    private final TokenService tokenService;
    private final FcmService fcmService;

    private static RadarMath radarMath = new RadarMath();
    private static final String GOOGLE_CLIENT_ID = "5095342969-dcob776t7ckfeu2gddkb2j4ke2cprfst.apps.googleusercontent.com";
    Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Transactional
    @Override
    public Token googleLogin(String googleIdToken) throws Exception {
        HttpTransport transport = new NetHttpTransport();
        JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();
        String email = null;
        try {
            GoogleIdToken idToken = verifier.verify(googleIdToken);
            if (idToken == null) throw new GoogleLoginFailException("Google?????? ???????????? ???????????????.");

            GoogleIdToken.Payload payload = idToken.getPayload();
            email = payload.getEmail();
        } catch (GeneralSecurityException e) {
            logger.debug("{}", e.getLocalizedMessage());
        } catch (IOException e) {
            logger.debug("{}", e.getLocalizedMessage());
        }

        String convertPw = UUID.randomUUID().toString().replace("-", "");
        logger.debug("????????? user Name : {}", convertPw);

        User user = userRepository.findByEmail(email).orElse(User.builder().name(convertPw).email(email).role(Role.USER).build());
        userRepository.save(user);

        //?????? ?????? ?????? DB???
        if (!locationRepository.existsByUserId(user.getId())) {
            Location location = Location.builder().user(user).latitude(new BigDecimal(0)).longitude(new BigDecimal(0)).build();
            locationRepository.save(location);
            RecordTime recordTime = RecordTime.builder().build();
            user.setRecordTime(recordTime);
            recordTimeRepository.save(recordTime);
        }

        //JWT ????????? ??? ????????????
        Token token = tokenService.generateToken(user.getId(), user.getName(), "USER");
        logger.debug("???????????? ????????? ????????? ?????? token : {}", token);

        //?????? ???????????? ??????
        user.updateRefreshToken(token.getRefresh_token());
        userRepository.save(user);

        return token;
    }

    @Override
    public String killApp(Long userPK) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        logger.debug("alive ?????? !!!!!! {} ", user.isAlive());
        user.setAlive(Boolean.FALSE);
        user.setKilled(LocalDateTime.now());
        userRepository.save(user);
        logger.debug("alive ?????? !!!!!! {} ", user.isAlive());
        return "Success";
    }

    @Override
    public String aliveApp(Long userPK) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        user.setAlive(Boolean.TRUE);
        userRepository.save(user);
        return "Success";
    }

    @Override
    public UserResponseDto getUserInfo(Long userPK) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        UserResponseDto userResponseDto = new UserResponseDto(user);
        logger.debug("getUserInfo log : {}", userPK);
        logger.debug("Service In");
        logger.debug("user : {}", user);
        return userResponseDto;
    }

    public User getUserInfoTwo(Long userPK) throws NoUserException {
        return userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
    }

    @Override
    public String duplicateCheckName(String userName) throws NoUserException {
        if (userRepository.existsByName(userName))
            return "?????? ???????????? ???????????????.";
        else
            return "Success";
    }

    @Override
    public String changeName(Long userPK, String userName) throws NoUserException, DuplicateNameException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        if (userRepository.existsByName(userName)) {
            throw new DuplicateNameException("?????? ???????????? ???????????????.");
        }
        user.setName(userName);
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String changeEmoji(Long userPK, String userEmoji) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        user.setUserEmoji(userEmoji);
        userRepository.save(user);
        return "Success";
    }

    /*
    ????????? privateZone??? ??????????????????.
     */
    @Transactional
    @Override
    public String setUpPrivateZone(Long userPK, String title, BigDecimal lat, BigDecimal lon) throws NoUserException {
        logger.debug("user pk check : {}", userPK);
        logger.debug("lat check : {}", lat);
        logger.debug("lon check : {}", lon);

        PrivateZone privateZone = PrivateZone.builder().title(title).lat(lat).lon(lon).build();
        logger.debug("privatezone : {}", privateZone);

        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        logger.debug("user privateZone???????????? : {}", user.getPrivateZones());

        privateZone.setUser(user);
        logger.debug("user privateZone get(0) : {}", user.getPrivateZones().get(0));

        userRepository.save(user);
        pzRepository.save(privateZone);
        return "Success";
    }

    @Override
    public List<ResponsePrivateZoneDto> getPrivateZone(Long userPK) throws NoUserException {
        if (!userRepository.existsById(userPK)) throw new NoUserException("???????????? ???????????? ????????????.");
        List<ResponsePrivateZoneDto> privateZones = pzRepository.findAllByUserId(userPK).stream().map((t) -> {
            ResponsePrivateZoneDto privateZoneDto = new ResponsePrivateZoneDto(t);
            return privateZoneDto;
        }).collect(Collectors.toList());
        return privateZones;
    }

    @Transactional
    @Override
    public String deletePrivateZone(Long userPK, Long pzPK) throws NoTargetException, NoUserException {
        if (!userRepository.existsById(userPK)) throw new NoUserException("???????????? ???????????? ????????????.");
        pzRepository.deleteByIdAndUserId(pzPK, userPK);
        return "Success";
    }

    public String setAllPush(Long userPK, Boolean accept, Boolean sync, int radius) throws Exception {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        if (accept == null || sync == null || radius < 0) throw new Exception("???????????? ??????");
        user.setAcceptPush(accept);
        user.setAcceptSync(sync);
        user.setAcceptRadius(radius);
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String setPushAlarmReceive(Long userPK, Boolean accept) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        user.setAcceptPush(accept);
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String setPushAlarmSync(Long userPK, Boolean sync) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        user.setAcceptSync(sync);
        userRepository.save(user);
        return "Success";
    }

    @Override
    public String setPushAlarmRadius(Long userPK, int radius) throws NoUserException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));
        user.setAcceptRadius(radius);
        userRepository.save(user);
        return "Success";
    }

    @Transactional
    @Override
    public List<ResponseUserLocationDto> getUserList(Long userPK, BigDecimal lat, BigDecimal lon, int radius, List<ResponseUserLocationDto> pastList) throws NoUserException, NoBrowserTokenException, IOException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("???????????? ???????????? ????????????."));

        //????????? Push message ????????? ????????????(?????? ???)
        if (user.isAcceptSync()) {
            user.setAcceptRadius(radius);
            userRepository.save(user);
        }

        // ??????????????? ????????? location??? ???????????????.
        setUserLocation(user, lat, lon);

        //????????? ?????? ResponseUserLocationDto : List ????????????
        List<ResponseUserLocationDto> nowList = getUserWithinRadius(user, lat, lon, radius);

        if (user.isAcceptPush() && fcmTokenRepository.existsByUserId(userPK)) {
            sendPush(user, nowList, pastList);
        }

        //return
        return nowList;
    }

    private void sendPush(User user, List<ResponseUserLocationDto> nowList, List<ResponseUserLocationDto> pastList) throws NoBrowserTokenException, IOException {
        int countOfNew = 0;
        Type targetContent = null;

        HashMap<String, RequestContentTimeDto> pushMap = new HashMap<>();

        for (ResponseUserLocationDto tmp : pastList) {
            pushMap.put(tmp.getName(), tmp.getContentTime());
        }

        for (int i = 0; i < nowList.size(); i++) {
            ResponseUserLocationDto target = nowList.get(i);
            if (!pushMap.containsKey(target.getName())) {
                countOfNew++;
            } else {
                RequestContentTimeDto past = pushMap.get(target.getName());
                if (target.getContentTime().getStatus() != null && (past.getStatus() == null || target.getContentTime().getStatus().isAfter(past.getStatus()))) {
                    targetContent = Type.STATUS;
                } else if (target.getContentTime().getImages() != null && (past.getImages() == null || target.getContentTime().getImages().isAfter(past.getImages()))) {
                    targetContent = Type.IMAGE;
                } else if (target.getContentTime().getSurvey() != null && (past.getSurvey() == null || target.getContentTime().getSurvey().isAfter(past.getSurvey()))) {
                    targetContent = Type.SURVEY;
                }
            }
        }

        LocalDateTime nowTime = LocalDateTime.now();
        logger.debug("LocalDataTime : {}", nowTime);
        FcmToken targetToken = fcmTokenRepository.findByUserId(user.getId()).orElseThrow(() -> new NoBrowserTokenException("????????????????????? ????????????...."));
        logger.debug("FCMToekn : {}", targetToken);
        //push

        // push server??? ?????? ????????? push ??????

        if (countOfNew != 0 && (targetToken.getPushOne() == null || nowTime.isAfter(targetToken.getPushOne()))) {
            String title = "?????? ?????? " + countOfNew + "?????? ????????? ?????? ???????????????!";
            String body = "???????????? ??????????????????";
            fcmService.sendMessageTo(targetToken.getToken(), title, body);
            targetToken.setPushOne(nowTime.plusHours(3));
        }

        if (targetContent != null && (targetToken.getPushTwo() == null || nowTime.isAfter(targetToken.getPushTwo()))) {
            StringBuilder title = new StringBuilder();
            title.append("????????? ??? ");
            switch (targetContent.getTitle()){
                case "???????????????":
                    title.append("?????? ????????????");
                    break;
                case "?????????":
                    title.append("????????????");
                    break;
                case "????????????":
                    title.append("?????????");
                    break;
            }
            title.append(" ????????????!");
            String body = "???????????? ??????????????????";
            fcmService.sendMessageTo(targetToken.getToken(), title.toString(), body);
            targetToken.setPushTwo(nowTime.plusHours(3));
        }

        fcmTokenRepository.save(targetToken);

    }

    @Override
    public List<ResponseUserLocationDto> getUserWithinRadius(User user, BigDecimal lat, BigDecimal lon, int radius) throws NoUserException {
        List<ResponseUserLocationDto> responseUserLocationDtoList = new ArrayList<>();

        // ????????? ?????? List ?????? ??? (?????? +- 0.04 ????????? ?????? ??????)
        List<Location> locationList = locationRepository.selectSQLBylatlon(lat, lon);
        for (int i = 0; i < locationList.size(); i++) {
            Location target = locationList.get(i);
            User targetUser = target.getUser();

            // ?????? ??? ????????? out
            if (!targetUser.isAlive()) continue;

            //????????? ?????? out
            if (target.getUser().getId() == user.getId()) continue;

            DistDto checkDist = radarMath.distance(lat, lon, target.getLatitude(), target.getLongitude());
//            logger.debug("????????? ???????????? dist test : {}", checkDist.toString());
            if (checkDist.getDist() > radius) continue;

            //privateZone?????? ?????? ??????check
            boolean userInPrivateZone = false;
            List<PrivateZone> privateZoneList = targetUser.getPrivateZones();
            for (int j = 0; j < privateZoneList.size(); j++) {
                PrivateZone targetPrivateZone = privateZoneList.get(j);
                DistDto targetInPrivateZone = radarMath.distance(targetPrivateZone.getLatitude(), targetPrivateZone.getLongitude(), target.getLatitude(), target.getLongitude());
                //targetUser??? ????????? privateZone 100 ????????? ????????? true
                if (targetInPrivateZone.getDist() < 100) {
                    userInPrivateZone = true;
                    break;
                }
            }

            //?????? PZ??????
//            if (privateZoneList.size() != 0) {
//                PrivateZone targetPrivateZone = privateZoneList.get(0);
//                DistDto targetInPrivateZone = radarMath.distance(targetPrivateZone.getLatitude(), targetPrivateZone.getLongitude(), target.getLatitude(), target.getLongitude());
//                //targetUser??? ????????? privateZone 100 ????????? ????????? true
//                if (targetInPrivateZone.getDist() < 100)
//                    userInPrivateZone = true;
//            }

            //targetUser??? ????????? time????????? ????????????.
            RequestContentTimeDto contentTimeDto = new RequestContentTimeDto(target.getUser().getRecordTime());

            //???????????? ?????? location
            ResponseUserLocationDto now = ResponseUserLocationDto.builder()
                    .name(targetUser.getName())
                    .emoji(targetUser.getUserEmoji())
                    .distDto(checkDist)
                    .privateZone(userInPrivateZone)
                    .contentTimeDto(contentTimeDto)
                    .build();

            responseUserLocationDtoList.add(now);
        }

        return responseUserLocationDtoList;
    }

    public void setUserLocation(User user, BigDecimal lat, BigDecimal lon) throws NoUserException {

        Location userLocation = locationRepository.findByUserId(user.getId()).orElse(null);
        if (userLocation == null) {
            userLocation = Location.builder().user(user).latitude(lat).longitude(lon).build();
        } else {
            userLocation.setLatitude(lat);
            userLocation.setLongitude(lon);
        }
        locationRepository.save(userLocation);
//        user.setLocation(userLocation);
//        userRepository.save(user);
    }

    @Transactional
    public String deleteUser(Long userPK) throws NoUserException, NoAuthorityUserException, NoContentException {
        if (!userRepository.existsById(userPK)) throw new NoUserException("???????????? ???????????? ????????????.");

        List<Content> contents = contentRepository.findAllByUserId(userPK);
        for (int i = 0; i < contents.size(); i++) {
            Content target = contents.get(i);
            contentService.deleteContent(userPK, target.getId());
        }

        reportedContentRepository.deleteAllByUserId(userPK);
        surveyContentAnswerRepository.deleteAllByUserId(userPK);
        emotionRepository.deleteAllByUserId(userPK);

        fcmTokenRepository.deleteByUserId(userPK);
        locationRepository.deleteByUserId(userPK);
        pzRepository.deleteAllByUserId(userPK);
        userRepository.deleteById(userPK);
        return "Success";
    }

}
