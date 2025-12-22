package com.shop.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventsListener {

    private static final Logger log = LoggerFactory.getLogger(OrderEventsListener.class);

    @KafkaListener(topics = "order-events", groupId = "order-log-service")
    public void handleOrderEvent(OrderEvent event) {
        log.info(">>> Received order kafka event: id={}, userId={}, status={}, total={}",
                event.getOrderId(),
                event.getUserId(),
                event.getStatus(),
                event.getTotalAmount());

        // - запис в отделна таблица (history)
        // - запис в отделна таблица (history)
        // - запис в отделна таблица (history)
        // - изпращане на email
        // - call към друг REST сървис и т.н.
    }
}
