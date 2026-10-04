package com.plantsandpaws.chat;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "").toLowerCase();

        String reply;
        if (message.contains("passport")) {
            reply = "Paws Passport is a future concept for care notes and adoption milestones. It is not issued or stored yet.";
        } else if (message.contains("nearby") || message.contains("vet") || message.contains("shelter") || message.contains("emergency")) {
            reply = "Open Nearby for an illustrative service directory. Listings are not live contacts or location results.";
        } else if (message.contains("lost") || message.contains("injured") || message.contains("kitten") || message.contains("puppy")) {
            reply = "If an animal is in immediate danger, contact verified local emergency or rescue services. You can also share a report here with a clear location and details.";
        } else if (message.contains("adopt")) {
            reply = "Open Adoption to explore the interest form. Adoption applications are not currently submitted or saved. 🐾";
        } else if (message.contains("report") || message.contains("animal")) {
            reply = "You can report an animal or plant from the Reports page. Add clear details and proof if available.";
        } else if (message.contains("verify")) {
            reply = "Submitted reports stay pending until an admin reviews the details and supporting proof.";
        } else if (message.contains("plant")) {
            reply = "Open Plants for care notes: check soil before watering, match light to the plant, and keep tender leaves out of harsh afternoon sun.";
        } else {
            reply = "Hi! I'm Paws Assistant 🌿 I can help with adoption, reports, plants, animals and verification.";
        }

        return Map.of("reply", reply);
    }
}
