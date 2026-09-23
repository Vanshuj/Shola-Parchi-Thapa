package com.spt.repository;

import com.spt.entity.UserPreference;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserPreferenceRepository extends MongoRepository<UserPreference, Long> {
}
