package com.hss.receptionist.catalog;

import com.hss.receptionist.business.Business;
import com.hss.receptionist.business.BusinessRepository;
import com.hss.receptionist.catalog.dto.FaqRequest;
import com.hss.receptionist.catalog.dto.FaqResponse;
import com.hss.receptionist.catalog.dto.ServiceRequest;
import com.hss.receptionist.catalog.dto.ServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final SalonServiceRepository serviceRepository;
    private final FaqRepository faqRepository;
    private final BusinessRepository businessRepository;

    // Services CRUD
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices(Long businessId) {
        return serviceRepository.findAllByBusinessId(businessId)
                .stream()
                .map(ServiceResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ServiceResponse createService(Long businessId, ServiceRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        SalonService service = new SalonService();
        service.setBusiness(business);
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        return ServiceResponse.fromEntity(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse updateService(Long id, Long businessId, ServiceRequest request) {
        SalonService service = serviceRepository.findByIdAndBusinessId(id, businessId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        if (request.getIsActive() != null) {
            service.setIsActive(request.getIsActive());
        }

        return ServiceResponse.fromEntity(service);
    }

    @Transactional
    public void deleteService(Long id, Long businessId) {
        SalonService service = serviceRepository.findByIdAndBusinessId(id, businessId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        serviceRepository.delete(service);
    }

    // FAQs CRUD
    @Transactional(readOnly = true)
    public List<FaqResponse> getAllFaqs(Long businessId) {
        return faqRepository.findAllByBusinessId(businessId)
                .stream()
                .map(FaqResponse::fromEntity)
                .toList();
    }

    @Transactional
    public FaqResponse createFaq(Long businessId, FaqRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        Faq faq = new Faq();
        faq.setBusiness(business);
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());

        return FaqResponse.fromEntity(faqRepository.save(faq));
    }

    @Transactional
    public FaqResponse updateFaq(Long id, Long businessId, FaqRequest request) {
        Faq faq = faqRepository.findByIdAndBusinessId(id, businessId)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));

        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());

        return FaqResponse.fromEntity(faq);
    }

    @Transactional
    public void deleteFaq(Long id, Long businessId) {
        Faq faq = faqRepository.findByIdAndBusinessId(id, businessId)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        faqRepository.delete(faq);
    }
}