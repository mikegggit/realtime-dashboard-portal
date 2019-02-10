package com.notatracer.monitoring.messaging;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.AbstractFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class OpeningMonitorListenerFactory extends AbstractFactoryBean<OpeningMonitorListener> implements ApplicationContextAware {

	private static Logger LOGGER = Logger.getLogger(OpeningMonitorListenerFactory.class);
	
	private ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext ctx) throws BeansException {
		this.applicationContext = ctx;
	}

	@Override
	protected OpeningMonitorListener createInstance() throws Exception {
			
		LOGGER.info("Creating instance of OpeningMonitorListener");
		final OpeningMonitorListener instance = new OpeningMonitorListener();
		if (instance != null) {
			applicationContext.getAutowireCapableBeanFactory().autowireBean(instance);
		}
		return instance;
	}

	@Override
	public boolean isSingleton() {
		return false;
	}
	
	@Override
	public Class<?> getObjectType() {
		return OpeningMonitorListener.class;
	}

}
