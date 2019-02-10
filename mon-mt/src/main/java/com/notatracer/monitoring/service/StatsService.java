package com.notatracer.monitoring.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.notatracer.monitoring.domain.ExchangeStats;
import com.notatracer.monitoring.domain.UndStats;
import com.notatracer.monitoring.data.StatsCache;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Path("/stats")
public class StatsService {

	private static Logger LOGGER = Logger.getLogger(StatsService.class);
	
	@Autowired
	private StatsCache cache;
	
    @GET
    @Path("/estats")
    @Produces("application/json")
    public Response exchangeStats() {
    	LOGGER.info("StatsService::exchangeStats");
    	Collection<ExchangeStats> statsByExchange = cache.getExchangeStats().values();
    	if (statsByExchange == null) {
    		return Response.notModified().header("Access-Control-Allow-Origin", "*").build();
    	}
    	List<ExchangeStats> result = new ArrayList<>(statsByExchange);
    	return Response.ok().entity(result).header("Access-Control-Allow-Origin", "*").build();
    }
    
    @GET
    @Path("/ustats")
    @Produces("application/json")
    public Response undStats(
    		@QueryParam("exchange") String exchange) {
    	LOGGER.info(String.format("StatsService::undStats [exchange=%s]", exchange));
    	Map<String, UndStats> undStats = cache.getUndStats(exchange.charAt(0));
    	if (undStats == null) {
    		return Response.notModified().header("Access-Control-Allow-Origin", "*").build();
    	}
    	Collection<UndStats> stats = cache.getUndStats(exchange.charAt(0)).values();
    	List<UndStats> result = new ArrayList<>(stats);
    	return Response.ok().entity(result).header("Access-Control-Allow-Origin", "*").build();
    }
    
}
