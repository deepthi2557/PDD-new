package com.skillswap.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PushNotificationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    /**
     * Sends a push notification to a device via the Expo Push API.
     * @param expoPushToken The recipient's Expo push token (e.g. ExponentPushToken[xxx])
     * @param title The title of the push notification
     * @param body The body message text
     * @param customData Optional key-value data payload
     */
    public void sendPushNotification(String expoPushToken, String title, String body, Map<String, Object> customData) {
        if (expoPushToken == null || expoPushToken.trim().isEmpty() || !expoPushToken.startsWith("ExponentPushToken")) {
            System.out.println("Skipping push notification: Invalid or missing token: " + expoPushToken);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("to", expoPushToken);
            payload.put("title", title);
            payload.put("body", body);
            if (customData != null) {
                payload.put("data", customData);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Push notification sent successfully to token: " + expoPushToken);
            } else {
                System.err.println("Failed to send push notification. Response code: " + response.getStatusCode() + ", Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Error sending push notification to Expo: " + e.getMessage());
        }
    }
}
