package com.shop.email.listener;

import com.shop.email.events.OrderEvent;
import com.shop.email.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventsListener {

    private static final Logger log = LoggerFactory.getLogger(OrderEventsListener.class);
    private final EmailService emailService;

    public OrderEventsListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "order-events", groupId = "notification-service")// в отделна consumer group, за да получава всички събития независимо от други listener-и.
    public void handleOrderEvent(OrderEvent event) {
        log.info("Received order kafka event: id={}, userId={}, email={}, status={}, total={}",
                event.getOrderId(),
                event.getUserId(),
                event.getUserEmail(),
                event.getStatus(),
                event.getTotalAmount());
        
        // Create email subject and body
        String subject = "Order Update: " + event.getStatus();
        String body = createEmailBody(event);
        
        // Send the email
        emailService.sendOrderConfirmationEmail(event.getUserEmail(), subject, body);
    }
    
    private String createEmailBody(OrderEvent event) {
        return "Dear Customer,\n\n" +
               "Your order #" + event.getOrderId() + " has been " + event.getStatus() + ".\n\n" +
               "Order Details:\n" +
               "- Order ID: " + event.getOrderId() + "\n" +
               "- Status: " + event.getStatus() + "\n" +
               "- Total Amount: $" + event.getTotalAmount() + "\n" +
               "- Created At: " + event.getCreatedAt() + "\n\n" +
               "Thank you for shopping with us!\n\n" +
               "Best regards,\n" +
               "The Online Shop Team";
    }
}