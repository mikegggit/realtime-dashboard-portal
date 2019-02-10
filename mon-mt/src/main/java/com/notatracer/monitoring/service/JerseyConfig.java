package com.notatracer.monitoring.service;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JerseyConfig extends ResourceConfig {

	public JerseyConfig() {
		super();
		register(Hello.class);
		register(StatsService.class);
		register(ConfigurationService.class);
	}

}
