package com.spt.dto.response;

public class CardDTO {
    private String id;
    private String type;
    private String label;

    public CardDTO(String id, String type, String label) {
        this.id = id;
        this.type = type;
        this.label = label;
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public String getLabel() { return label; }
}
