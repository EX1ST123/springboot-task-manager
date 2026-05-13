package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.enums.Category;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:category IS NULL OR t.category = :category) " +
           "AND (:priority IS NULL OR t.priority = :priority)")
    List<Task> findByUserIdWithFilters(@Param("userId") Long userId, @Param("status") Status status, 
                                       @Param("category") Category category, @Param("priority") Priority priority);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, Status status);
}