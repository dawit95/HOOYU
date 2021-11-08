package com.status.backend.emotion.service;

import com.status.backend.content.domain.Content;
import com.status.backend.content.domain.ContentRepository;
import com.status.backend.emotion.domain.Emotion;
import com.status.backend.emotion.domain.EmotionRepository;
import com.status.backend.emotion.dto.EmotionDto;
import com.status.backend.emotion.dto.ResponseEmotionsDto;
import com.status.backend.global.exception.NoContentException;
import com.status.backend.global.exception.NoEmotionException;
import com.status.backend.global.exception.NoUserException;
import com.status.backend.user.domain.User;
import com.status.backend.user.domain.UserRepository;
import com.status.backend.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EmotionServiceImpl implements EmotionService {
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final EmotionRepository emotionRepository;

    Logger logger = LoggerFactory.getLogger(EmotionServiceImpl.class);

    @Transactional
    @Override
    public List<EmotionDto> getEmotions(Long contentPK) throws NoContentException {
        if (!contentRepository.existsById(contentPK)) throw new NoContentException("해당하는 컨탠츠는 없습니다.");
        List<EmotionDto> emotions = emotionRepository.findByContentId(contentPK).stream().map(EmotionDto::new).collect(Collectors.toList());
        return emotions;
    }

    @Transactional
    @Override
    public String toEmotion(Long userPK, Long contentPK, String contentEmoji) throws NoUserException, NoContentException, NoEmotionException {
        User user = userRepository.findById(userPK).orElseThrow(() -> new NoUserException("해당하는 사용자가 없습니다."));
        Content content = contentRepository.findById(contentPK).orElseThrow(() -> new NoContentException("해당하는 컨탠츠는 없습니다."));
        String message = "";
        Emotion emotion;
        if (emotionRepository.existsByUserIdAndContentIdAndContentEmoji(userPK, contentPK, contentEmoji)) {
            emotion = emotionRepository.findByUserIdAndContentIdAndContentEmoji(userPK, contentPK, contentEmoji).orElseThrow(() -> new NoEmotionException("공감중에 문제가 발생했습니다."));
            emotionRepository.deleteById(emotion.getId());
            message = "성공적으로 공감을 취소했습니다.";
        } else {
            emotion = Emotion.builder().user(user).content(content).contentEmoji(contentEmoji).build();
            emotionRepository.save(emotion);
            message = "성공적으로 공감했습니다.";
        }
        return message;
    }
}