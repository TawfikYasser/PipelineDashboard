package io.dashboardhub.pipelinedashboard.service;

import io.dashboardhub.pipelinedashboard.domain.User;
import io.dashboardhub.pipelinedashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByCurrentUser() {
        return this.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    public User saveByCurrentUser(User user) {
        user.setUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return this.save(user);
    }

    public User findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public User save(User user) {
        User existingUser = this.findByUsername(user.getUsername());
        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setLastLoggedIn(user.getLastLoggedIn());

            return this.userRepository.save(existingUser);
        }

        return this.userRepository.save(user);
    }
}

