package com.notatracer.monitoring.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.notatracer.monitoring.domain.UndStats;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Path("/config")
public class ConfigurationService {
	private static Logger LOGGER = Logger.getLogger(ConfigurationService.class);

	@Autowired
	private Config config;
	
    @GET
    @Path("/list")
    @Produces("application/json")
    public Response listConfiguration(
    		@QueryParam("exchange") String exchange) {
    	/*
    	 * config passed to ui:
    	 * 
    	 * {
    	 *   thresholds: [
    	 *     {
    	 *       minutesAfterOpen: 5,
    	 *       warning: 10,
    	 *       critical: 25
    	 *     },
    	 *     {
    	 *       minutesAfterOpen: 10,
    	 *       warning: 5,
    	 *       critical: 10
    	 *     },
    	 *     {
    	 *       minutesAfterOpen: 30,
    	 *       warning: 1,
    	 *       critical: 5
    	 *     }
    	 *   ]
    	 * }
    	 */
    	UndStats.OpeningAlarm alarm = config.getAlarmByExchange().get(exchange);
    	return Response.ok().entity(alarm).header("Access-Control-Allow-Origin", "*").build();
    }

	@ConfigurationProperties
    @Component
    public static class Config {
        private String version;
        private List<String> urls = new ArrayList<String>();
        private Map<String, UndStats.OpeningAlarm> alarmByExchange = new HashMap<>();
        public String getVersion() {
            return version;
        }
        public List<String> getUrls() {
            return urls;
        }
        public Map<String, UndStats.OpeningAlarm> getAlarmByExchange() {
            return alarmByExchange;
        }

    }
}
