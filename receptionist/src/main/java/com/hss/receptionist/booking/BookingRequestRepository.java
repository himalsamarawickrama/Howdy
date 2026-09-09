package com.hss.receptionist.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    @Query("SELECT b FROM BookingRequest b JOIN FETCH b.customer WHERE b.business.id = :businessId ORDER BY b.createdAt DESC")
    List<BookingRequest> findAllByBusinessId(@Param("businessId") Long businessId);

    @Query("SELECT b FROM BookingRequest b JOIN FETCH b.customer WHERE b.id = :id AND b.business.id = :businessId")
    Optional<BookingRequest> findByIdAndBusinessId(@Param("id") Long id, @Param("businessId") Long businessId);

    Optional<BookingRequest> findByBusinessIdAndCustomerIdAndStatus(Long businessId, Long customerId, String status);

    long countByBusinessIdAndStatus(Long businessId, String status);

    @Query("SELECT COUNT(b) FROM BookingRequest b WHERE b.business.id = :businessId")
    long countByBusinessId(@Param("businessId") Long businessId);
}