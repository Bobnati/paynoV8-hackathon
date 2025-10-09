package com._paynov8.paynov8backend.notification.service.impl;

import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.common.service.EmailService;
import com._paynov8.paynov8backend.notification.model.Notification;
import com._paynov8.paynov8backend.notification.repository.NotificationRespository;
import com._paynov8.paynov8backend.notification.service.NotificationService;
import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final EmailService emailService;
    private final NotificationRespository notificationRepository;

    @Async
    @Override
    public void notifyGroupParticipants(SplitPayment payment, Group group) {
        for (SplitParticipant participant : payment.getParticipants()) {

            if (participant.getUserId().equals(payment.getCreatorId())) continue;

            String message = "You’ve been added to a split payment for " +
                    payment.getPurpose() + ". Amount: ₦" + participant.getAmount();

            Notification notification = Notification.builder()
                    .userId(participant.getUserId())
                    .groupId(payment.getGroupId())
                    .title("Split Payment Invitation")
                    .message(message)
                    .link(participant.getPaymentLink())
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            System.out.println("NOTIFICATION SAVED → " + participant.getUserId() + ": " + message);
        }
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getGroupNotifications(String groupId) {
        return notificationRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    @Override
    public void notifyPaymentSuccess(String userId, String title, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }
//    @Async
//    @Override
//    public void notifyParticipant(SplitParticipant participant, SplitPayment payment, String email) {
//
//        String message = """
//        You’ve been added to a split payment for: %s
//
//        Your share: ₦%s
//        Total amount to pay: ₦%s
//
//        Please complete your payment using the provided Paystack link.
//        """.formatted(
//                payment.getPurpose(),
//                participant.getAmount(),
//                payment.getTotalAmount()
//        );
//
//
//        String paystackLink = participant.getPaymentLink() != null
//                    ? participant.getPaymentLink()
//                    : "https://checkout.paystack.com/" + payment.getId() + "/" + participant.getUserId();
//
//            Notification notification = new Notification(
//                    participant.getUserId(),
//                    message,
//                    payment.getId(),
//                    payment.getGroupId(),
//                    paystackLink,
//                    LocalDateTime.now()
//            );
//
//            notificationRespository.save(notification);
//
//            try {
//                    emailService.sendEmail(
//                            email,
//                            "New Split Payment Invitation",
//                            buildHtmlEmail(payment, participant)
//                    );
//
//            } catch (Exception e) {
//                System.err.println("Failed to send email to " + participant.getUserId() + ": " + e.getMessage());
//            }
//
//            System.out.println("NOTIFICATION SENT → " + participant.getUserId() + ": " + message);
//    }



//    @Async
//    @Override
//    public void notifyParticipants(SplitPayment payment) {
////        List<String> emails = List.of(
////                "salamitijani02@gmail.com",
////                "testUser@gmail.com",
////                "hammed@gmail.com"
////        );
////
////        int count = 0;
//
//        for (SplitParticipant participant : payment.getParticipants()) {
//            String message = "You’ve been added to a split payment for " +
//                    payment.getPurpose() +
//                    ". Amount: ₦" + participant.getAmount();
//
//            String paystackLink = participant.getPaymentLink() != null
//                    ? participant.getPaymentLink()
//                    : "https://checkout.paystack.com/" + payment.getId() + "/" + participant.getUserId();
//
//            Notification notification = new Notification(
//                    participant.getUserId(),
//                    message,
//                    payment.getId(),
//                    paystackLink,
//                    LocalDateTime.now()
//            );
//
//            notifications.add(notification);
//
//            try {
////                if (count < emails.size()) {
////                    String email = emails.get(count);
//                    emailService.sendEmail(
//                            email,
//                            "New Split Payment Invitation",
//                            buildHtmlEmail(payment, participant)
//                    );
////                    Thread.sleep(1000);
////                } else {
////                    System.err.println("No email available for participant: " + participant.getUserId());
////                }
//            } catch (Exception e) {
//                System.err.println("Failed to send email to " + participant.getUserId() + ": " + e.getMessage());
//            }
//
////            count++;
//
//            System.out.println("NOTIFICATION SENT → " + participant.getUserId() + ": " + message);
//        }
//    }

    private String buildHtmlEmail(SplitPayment payment, SplitParticipant participant) {
        return """
                <html>
                  <body>
                    <h3>Split Payment Invitation</h3>
                    <p>You’ve been added to a split payment for: <strong>%s</strong></p>
                     <p>Total amount splited: <strong>₦%s</strong></p>
                    <p>Your share: <strong>₦%s</strong></p>
                    <p>Click below to complete your payment:</p>
                    <a href="%s" style="background:#2b6cb0;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">Pay Now</a>
                    <br><br>
                    <small>Paynov8 Hackathon Project</small>
                  </body>
                </html>
                """.formatted(payment.getPurpose(), payment.getTotalAmount(),participant.getAmount(), participant.getPaymentLink());
    }
}