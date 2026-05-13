package com.taskflow.service;

import com.taskflow.dto.UserDto;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDto.ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return toResponse(user);
    }

    @Transactional
    public UserDto.ProfileResponse updateProfile(Long userId, UserDto.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (request.getMainGoal() != null)  user.setMainGoal(request.getMainGoal());
        if (request.getWorkRhythm() != null) user.setWorkRhythm(request.getWorkRhythm());
        if (request.getIaEnabled() != null)  user.setIaEnabled(request.getIaEnabled());

        return toResponse(userRepository.save(user));
    }

    private UserDto.ProfileResponse toResponse(User u) {
        UserDto.ProfileResponse dto = new UserDto.ProfileResponse();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setMainGoal(u.getMainGoal());
        dto.setWorkRhythm(u.getWorkRhythm());
        dto.setIaEnabled(u.isIaEnabled());
        return dto;
    }
}