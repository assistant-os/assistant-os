Feature: Light and music

  # Scenario: User wakes up smartly
  #   When the Alarm clocks is triggered
  #   Then Home lights on the bedroom
  #   And Home describes the weather of the day
  #   And Home describes the calendar of the day

  Scenario: User is entering the living room
    When a first person enters in the Living room
    Then switch on lights in the Living room

# Scenario: User is leaving the house
#   When the User leaves the house
#   Then Home lights off the living room

# Scenario: User is entering the house
#   When the User enters in the house
#   Then Home plays music

# Scenario: User is entering the bedroom room
#   When the User enters in the bedroom
#   Then Home lights on the bedroom

# Scenario: User is leaving the bedroom
#   When the User leaves the bedroom
#   Then Home lights off the bedroom

# Scenario: User is going to bed
#   When the User goes to bed
#   Then Home lights off the bedroom
#   And Home lights off the living room
#   And Computer goes to sleep

# Scenario: User works
#   When the User works at home
#   Then Home light on the living room with Stimulation scene

# Scenario: evening
#   When the evening comes
#   And the User is at home
#   Then Home lights on the living room with Evening scene

