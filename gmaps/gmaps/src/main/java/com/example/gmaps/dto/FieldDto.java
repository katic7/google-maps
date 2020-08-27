package com.example.gmaps.dto;

import java.util.ArrayList;
import java.util.List;

import com.example.gmaps.model.Coordinate;
import com.example.gmaps.model.Field;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FieldDto {

	private Long id;
	private String name;
	private String cereals;
	private List<CoordinateDto> coords = new ArrayList<CoordinateDto>();
	
	public FieldDto(Field f) {
		id = f.getId();
		name = f.getName();
		cereals = f.getCereals();
		if(f.getCoords() != null) {
			for(Coordinate c : f.getCoords()) {
				CoordinateDto cdto = new CoordinateDto();
				cdto.setLat(c.getLat());
				cdto.setLng(c.getLng());
				coords.add(cdto);
			}
		}
	}
}
