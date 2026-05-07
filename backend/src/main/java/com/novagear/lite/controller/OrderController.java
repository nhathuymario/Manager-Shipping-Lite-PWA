package com.novagear.lite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allow frontend to call this
public class OrderController {

    @PutMapping("/{barcode}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String barcode, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        
        // In a real application, you'd lookup the order by barcode and update it in DB
        System.out.println("Updating order " + barcode + " to status: " + newStatus);
        
        return ResponseEntity.ok().body(Map.of(
            "message", "Order updated successfully",
            "barcode", barcode,
            "status", newStatus
        ));
    }
    
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
