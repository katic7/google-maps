package com.example.gmaps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmaps.model.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, Long>{

}
