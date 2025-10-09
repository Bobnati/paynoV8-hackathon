package com._paynov8.paynov8backend.user.service;

import com._paynov8.paynov8backend.user.config.JwtTokenProvider;
import com._paynov8.paynov8backend.emailService.EmailDetails;
import com._paynov8.paynov8backend.emailService.IEmailService;
import com._paynov8.paynov8backend.user.dto.LoginDto;
import com._paynov8.paynov8backend.user.dto.LoginResponse;
import com._paynov8.paynov8backend.user.dto.RegReqDto;
import com._paynov8.paynov8backend.user.dto.RegResponse;
import com._paynov8.paynov8backend.user.enums.Role;
import com._paynov8.paynov8backend.user.model.User;
import com._paynov8.paynov8backend.user.repository.UserRepository;
import com._paynov8.paynov8backend.user.util.AccountUtil;
import com._paynov8.paynov8backend.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    IEmailService emailService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    WalletService walletService;


    @Override
    public RegResponse createAccount(RegReqDto request) {
        Optional<User> foundUser = userRepository.findByEmail(request.getEmail());

        if (foundUser.isPresent()) {
            return RegResponse.builder()
                    .responseCode(AccountUtil.SUCCESS_CODE)
                    .message(AccountUtil.ACCOUNT_EXISTS_MESSAGE)
                    .build();
        }

        User newUser = User.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .accountNumber(AccountUtil.generateAccountNumber())
                .phoneNumber(request.getPhoneNumber())
                .walletBalance(BigDecimal.ZERO)
                .savingsBalance(BigDecimal.ZERO)
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.INDIVIDUAL)
                .build();

        User savedUser = userRepository.save(newUser);
        walletService.createWalletForUser(savedUser.getId(), savedUser.getAccountNumber());

//        EmailDetails emailDetails = EmailDetails.builder()
//                .recipient(savedUser.getEmail())
//                .subject("Welcome To PaynoV8 Plc.")
//                .messageBody("Hello " + savedUser.getFirstName() + " " + savedUser.getMiddleName() + " " + savedUser.getLastName() + ",\n" +
//                        "We want to specially thank you for choosing PaynoV8. Indeed, we stand true to our name as we promise you a jolly ride. \n" +
//                        "Kindly find your account details below: \n" +
//                        "Account Number: " + savedUser.getAccountNumber() + ",\n" +
//                        "Account Balance: NGN" + savedUser.getWalletBalance() + ".00\n" +
//                        "PLEASE FEEL FREE TO REACH OUT TO US FOR ANY ENQUIRIES THROUGH ANY OF OUR CHANNELS.\n" +
//                        "\n Kind regards,\n" +
//                        "Chukwu Joel Chimaobi\n" +
//                        "Head, Customer Success Dept!")
//                .build();
//
//        emailService.sendEmailAlert(emailDetails);


        return RegResponse.builder()
                .responseCode(AccountUtil.ACCOUNT_CREATION_CODE)
                .message(AccountUtil.ACCOUNT_SUCCESS_MESSAGE)
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .accountNumber(savedUser.getAccountNumber())
                .middleName(savedUser.getMiddleName())
                .email(savedUser.getEmail())
                .address(savedUser.getAddress())
                .accountNumber(savedUser.getAccountNumber())
                .build();
    }

    @Override
    public LoginResponse login(LoginDto loginDto) {
        Authentication authentication = null;
        authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

//        EmailDetails loginAlert = EmailDetails.builder()
//                .subject("Successful Login")
//                .recipient(loginDto.getEmail())
//                .messageBody("You have successfully logged into your account at " + LocalDateTime.now() + " " +
//                        "Please contact customer care if you did not initiate this request immediately.")
//                .build();
//
//        emailService.sendEmailAlert(loginAlert);

        return LoginResponse.builder()
                .statusCode(AccountUtil.SUCCESS_CODE)
                .message(jwtTokenProvider.generateToken(authentication))
                .build();
    }
}
