package com.taskflow.enums;

import lombok.Getter;

@Getter
public enum Category {
    WORK("Work"),
    PERSONAL("Personal"),
    URGENT("Urgent"),
    OTHER("Other"),
    STUDIES("Studies");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }
}