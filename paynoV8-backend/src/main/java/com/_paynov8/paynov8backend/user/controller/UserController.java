package com._paynov8.paynov8backend.user.controller;

import com._paynov8.paynov8backend.user.dto.LoginDto;
import com._paynov8.paynov8backend.user.dto.LoginResponse;
import com._paynov8.paynov8backend.user.dto.RegReqDto;
import com._paynov8.paynov8backend.user.dto.RegResponse;
import com._paynov8.paynov8backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping(path = "/create")
    public RegResponse createAccount(@RequestBody RegReqDto regRequest) {
        return userService.createAccount(regRequest);
    }

    @PostMapping(path = "/login")
    public LoginResponse login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto);
    }

}
