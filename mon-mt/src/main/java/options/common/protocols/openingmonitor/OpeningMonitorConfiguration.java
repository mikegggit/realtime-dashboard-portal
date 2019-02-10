package options.common.protocols.openingmonitor;

import com.notatracer.monitoring.messaging.OpeningMonitorListener;
import com.notatracer.monitoring.messaging.OpeningMonitorListenerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class OpeningMonitorConfiguration {

	@Bean(name="openingMonitorListenerFactory")
	public OpeningMonitorListenerFactory openingMonitorListenerFactory() {
		OpeningMonitorListenerFactory factory = new OpeningMonitorListenerFactory();
		return factory;
	}
	
	@Bean
	@Scope("prototype")
	public OpeningMonitorListener openingMonitorListener() throws Exception {
		return openingMonitorListenerFactory().getObject();
	}
}
