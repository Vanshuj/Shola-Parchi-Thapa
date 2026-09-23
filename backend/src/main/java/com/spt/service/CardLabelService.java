package com.spt.service;

import com.spt.dto.response.LabelResponse;
import com.spt.entity.CardLabel;
import com.spt.exception.BadRequestException;
import com.spt.repository.CardLabelRepository;
import com.spt.validation.LabelValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CardLabelService {

    private static final List<String> CARD_TYPES = List.of("TYPE_1", "TYPE_2", "TYPE_3", "TYPE_4");
    private static final Map<String, String> DEFAULTS = Map.of(
            "TYPE_1", "Type 1", "TYPE_2", "Type 2", "TYPE_3", "Type 3", "TYPE_4", "Type 4");

    private final CardLabelRepository repository;
    private final LabelValidator validator;

    public CardLabelService(CardLabelRepository repository, LabelValidator validator) {
        this.repository = repository;
        this.validator = validator;
    }

    public Map<String, String> getLabels(Long userId) {
        Map<String, String> labels = new LinkedHashMap<>(DEFAULTS);
        for (CardLabel cl : repository.findByUserId(userId)) {
            labels.put(cl.getCardType(), cl.getLabel());
        }
        return labels;
    }

    @Transactional
    public Map<String, String> updateLabels(Long userId, Map<String, String> labels) {
        for (Map.Entry<String, String> entry : labels.entrySet()) {
            if (!CARD_TYPES.contains(entry.getKey())) {
                throw new BadRequestException("INVALID_LABEL", "Unknown card type " + entry.getKey());
            }
            setLabel(userId, entry.getKey(), entry.getValue());
        }
        return getLabels(userId);
    }

    @Transactional
    public LabelResponse updateOne(Long userId, String cardType, String label) {
        if (!CARD_TYPES.contains(cardType)) {
            throw new BadRequestException("INVALID_LABEL", "Unknown card type " + cardType);
        }
        CardLabel saved = setLabel(userId, cardType, label);
        return new LabelResponse(saved.getCardType(), saved.getLabel(), saved.getUpdatedAt());
    }

    @Transactional
    public void resetToDefaults(Long userId) {
        repository.deleteByUserId(userId);
    }

    private CardLabel setLabel(Long userId, String cardType, String label) {
        String clean = validator.validateAndClean(label);
        CardLabel entity = repository.findByUserIdAndCardType(userId, cardType).orElseGet(CardLabel::new);
        entity.setUserId(userId);
        entity.setCardType(cardType);
        entity.setLabel(clean);
        entity.setUpdatedAt(Instant.now());
        return repository.save(entity);
    }
}
