Feature: Light and music

  Scenario: User is entering the living room
    When a first person enters in the Living room
    Then switch on lights in the Living room

  Scenario: User is leaving the living room
    When the last person leaves the Living room
    Then switch off lights in the Living room

  Scenario: User is entering the Bedroom
    When a first person enters in the Bedroom
    Then switch on lights in the Bedroom

  Scenario: User is leaving the Bedroom
    When the last person leaves the Bedroom
    Then switch off lights in the Bedroom