package com.example.gmaps.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmaps.dto.CoordinateDto;
import com.example.gmaps.dto.FieldDto;
import com.example.gmaps.model.Coordinate;
import com.example.gmaps.model.Field;
import com.example.gmaps.repository.CoordinateRepository;
import com.example.gmaps.repository.FieldRepository;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/field")
public class FieldController {

	@Autowired
	FieldRepository fieldRepo;
	
	@Autowired
	CoordinateRepository coorRepo;
	
	@GetMapping("/test")
	public ResponseEntity<?> test(){
		return new ResponseEntity<String>("test",HttpStatus.OK);
	}
	
	@PostMapping("create")
	public ResponseEntity<?> createField(@RequestBody FieldDto fieldDto){
		Field f = new Field();
		f.setName(fieldDto.getName());
		f.setCereals(fieldDto.getCereals());
		f = fieldRepo.save(f);
		FieldDto fdto = new FieldDto(f);
		for(CoordinateDto cdto :fieldDto.getCoords()) {
			Coordinate cor = new Coordinate();
			cor.setLat(cdto.getLat());
			cor.setLng(cdto.getLng());
			cor.setField(f);
			coorRepo.save(cor);
		}
		return new ResponseEntity<FieldDto>(fdto,HttpStatus.OK);
	}
	
	@GetMapping("getAll")
	public ResponseEntity<?> getAll(){
		List<FieldDto> retVal = new ArrayList<FieldDto>();
		List<Field> fields = fieldRepo.findAll();
		for(Field f : fields) {
			FieldDto fdto = new FieldDto(f);
			retVal.add(fdto);
		}
		return new ResponseEntity<List<FieldDto>>(retVal,HttpStatus.OK);
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteField(@PathVariable Long id){
		Field f = fieldRepo.getOne(id);
		if(f == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}else {
			fieldRepo.delete(f);
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}
}
