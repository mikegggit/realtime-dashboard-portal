package com.notatracer.monitoring.service;


import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.springframework.stereotype.Component;

@Component
@Path("/hello")
public class Hello {


	@GET
	public String message() {
		return "Hello";
	}

}