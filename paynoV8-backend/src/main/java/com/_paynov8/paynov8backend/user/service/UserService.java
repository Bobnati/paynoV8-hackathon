package com._paynov8.paynov8backend.user.service;

import com._paynov8.paynov8backend.user.dto.LoginDto;
import com._paynov8.paynov8backend.user.dto.RegResponse;
import com._paynov8.paynov8backend.user.dto.RegReqDto;

public interface UserService {

    RegResponse createAccount(RegReqDto request);

    LoginResponse login(LoginDto loginDto);
}
