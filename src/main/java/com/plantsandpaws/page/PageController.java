package com.plantsandpaws.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping({"/", "/home"})
    public String home() { return "forward:/index.html"; }

    @GetMapping("/animals")
    public String animals() { return "forward:/animals.html"; }

    @GetMapping("/plants")
    public String plants() { return "forward:/plants.html"; }

    @GetMapping("/nearby")
    public String nearby() { return "forward:/nearby.html"; }

    @GetMapping("/reports")
    public String reports() { return "forward:/reports.html"; }

    @GetMapping("/my-reports")
    public String myReports() { return "forward:/my-reports.html"; }

    @GetMapping("/adoption")
    public String adoption() { return "forward:/adoption.html"; }

    @GetMapping("/admin")
    public String admin() { return "forward:/admin.html"; }

    @GetMapping("/admin/verification")
    public String verification() { return "forward:/admin.html"; }

    @GetMapping("/login")
    public String login() { return "forward:/login.html"; }

    @GetMapping("/register")
    public String register() { return "forward:/register.html"; }
}
