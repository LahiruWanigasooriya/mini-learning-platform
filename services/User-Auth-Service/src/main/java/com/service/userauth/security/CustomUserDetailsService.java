package com.service.userauth.security;

import com.service.userauth.entity.User;
import com.service.userauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Gather role authorities like ROLE_STUDENT
        List<SimpleGrantedAuthority> roleAuthorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());

        // Gather permission authorities from all roles
        List<SimpleGrantedAuthority> permissionAuthorities = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toList());

        List<SimpleGrantedAuthority> allAuthorities = Stream.concat(
                roleAuthorities.stream(), permissionAuthorities.stream()
        ).collect(Collectors.toList());

        // Get password hash from AuthCredential
        String passwordHash = user.getAuthCredential() != null
                ? user.getAuthCredential().getPasswordHash()
                : "";

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(passwordHash)
                .authorities(allAuthorities)
                .accountExpired(false)
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
}
