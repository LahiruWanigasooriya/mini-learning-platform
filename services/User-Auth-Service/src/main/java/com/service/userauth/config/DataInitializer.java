package com.service.userauth.config;

import com.service.userauth.entity.Permission;
import com.service.userauth.entity.Role;
import com.service.userauth.repository.PermissionRepository;
import com.service.userauth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedPermissions();
        seedRoles();
    }

    private void seedPermissions() {
        List<String[]> permissions = Arrays.asList(
            new String[]{"COURSE_CREATE", "Can create courses"},
            new String[]{"COURSE_EDIT", "Can edit courses"},
            new String[]{"COURSE_DELETE", "Can delete courses"},
            new String[]{"COURSE_VIEW", "Can view courses"},
            new String[]{"ENROLLMENT_MANAGE", "Can manage enrollments"},
            new String[]{"USER_MANAGE", "Can manage users"},
            new String[]{"REPORT_VIEW", "Can view reports"}
        );

        for (String[] perm : permissions) {
            if (!permissionRepository.existsByName(perm[0])) {
                permissionRepository.save(Permission.builder()
                        .name(perm[0])
                        .description(perm[1])
                        .build());
                log.info("Created permission: {}", perm[0]);
            }
        }
    }

    private void seedRoles() {
        // STUDENT role
        if (!roleRepository.existsByName("STUDENT")) {
            Set<Permission> studentPerms = new HashSet<>();
            permissionRepository.findByName("COURSE_VIEW").ifPresent(studentPerms::add);
            permissionRepository.findByName("ENROLLMENT_MANAGE").ifPresent(studentPerms::add);

            roleRepository.save(Role.builder()
                    .name("STUDENT")
                    .description("Enrolled learner on the platform")
                    .permissions(studentPerms)
                    .build());
            log.info("Created role: STUDENT");
        }

        // INSTRUCTOR role
        if (!roleRepository.existsByName("INSTRUCTOR")) {
            Set<Permission> instructorPerms = new HashSet<>();
            List.of("COURSE_CREATE", "COURSE_EDIT", "COURSE_VIEW", "ENROLLMENT_MANAGE", "REPORT_VIEW")
                    .forEach(name -> permissionRepository.findByName(name).ifPresent(instructorPerms::add));

            roleRepository.save(Role.builder()
                    .name("INSTRUCTOR")
                    .description("Course instructor - can create and manage courses")
                    .permissions(instructorPerms)
                    .build());
            log.info("Created role: INSTRUCTOR");
        }

        // ADMIN role
        if (!roleRepository.existsByName("ADMIN")) {
            Set<Permission> adminPerms = new HashSet<>(permissionRepository.findAll());

            roleRepository.save(Role.builder()
                    .name("ADMIN")
                    .description("Platform administrator - full access")
                    .permissions(adminPerms)
                    .build());
            log.info("Created role: ADMIN");
        }
    }
}
