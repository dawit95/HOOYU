package com.status.backend.global.web;

import com.status.backend.global.dto.ExceptionResponseDto;
import com.status.backend.global.exception.NoContentException;
import com.status.backend.global.exception.NoUserException;
import com.status.backend.global.service.ResponseGenerateService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RequiredArgsConstructor
@ControllerAdvice
public class ExceptionController {

    private final ResponseGenerateService responseGenerateService;
    private final Logger logger = LoggerFactory.getLogger(ExceptionController.class);

    @ExceptionHandler(EmptyResultDataAccessException.class)
    protected ResponseEntity<ExceptionResponseDto> handleEmptyResultDataAccess(EmptyResultDataAccessException e) {
        logger.error("[EmptyResultDataAccessException] ", e);

        String message = "잘못된 데이터 접근입니다.";
        HttpStatus status = HttpStatus.NOT_FOUND;
        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(status, message);

        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, status);
    }

    @ExceptionHandler(NoUserException.class)
    protected ResponseEntity<ExceptionResponseDto> handleNoUser(NoUserException e) {
        logger.error("[No User Exception] ", e);

        String message = "없는 사용자입니다.";
        HttpStatus status = HttpStatus.NOT_FOUND;
        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(status, message);

        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, status);
    }

    @ExceptionHandler(NoContentException.class)
    public ResponseEntity<ExceptionResponseDto> noRouteHandler(NoContentException e) {
        logger.error("[No Content Exception] ", e);
        HttpStatus httpStatus = HttpStatus.NOT_FOUND;
        String message = "없는 컨탠츠 요청입니다.";

        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(httpStatus, message);
        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, httpStatus);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ExceptionResponseDto> noAcceptJWTHandler(ExpiredJwtException e) {
        logger.error("[No Content Exception] ", e);
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        String message = "만료된 JWT 토큰입니다.";

        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(httpStatus, message);
        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, httpStatus);
    }

    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<ExceptionResponseDto> noAcceptJWTHandler(UnsupportedJwtException e) {
        logger.error("[No Content Exception] ", e);
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        String message = "지원되지 않는 JWT 토큰입니다.";

        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(httpStatus, message);
        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, httpStatus);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> noAcceptJWTHandler(IllegalArgumentException e) {
        logger.error("[No Content Exception] ", e);
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        String message = "JWT 토큰이 잘못되었습니다.";

        ExceptionResponseDto exceptionResponseDto = responseGenerateService.generateExceptionResponse(httpStatus, message);
        return new ResponseEntity<ExceptionResponseDto>(exceptionResponseDto, httpStatus);
    }
}