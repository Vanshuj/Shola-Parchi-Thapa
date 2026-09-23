package com.spt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LabelUpdateRequest {

    @NotBlank
    @Size(max = 12)
    private String label;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}
