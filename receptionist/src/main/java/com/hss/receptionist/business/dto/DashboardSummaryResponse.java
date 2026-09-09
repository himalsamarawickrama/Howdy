package com.hss.receptionist.business.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long todaysConversations;
    private long newCustomers;
    private long aiResponses;
    private long humanHandovers;
    private long pendingRequests;
    private String popularOffering;
}