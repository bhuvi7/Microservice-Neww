package com.springprofiles.springProfiles;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/")
@RestController
public class HelloResource {

	@Value("${spring.datasource.url}")
	private String message;
	
	@GetMapping("/hello")
	public String hello() {
		return message;
	}
}
