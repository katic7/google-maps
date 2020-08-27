package com.example.gmaps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmaps.model.Coordinate;

@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long>{

}
