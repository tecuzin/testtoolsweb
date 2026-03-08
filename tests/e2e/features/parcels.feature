Feature: Gestion agricole de bout en bout

  Background:
    Given la base de demonstration est reinitialisee

  Scenario: Creer une parcelle depuis l'interface
    When j'ouvre l'application
    And je cree une parcelle "Parcelle Demo E2E" de 2.4 ha a "Secteur Test"
    Then la parcelle "Parcelle Demo E2E" apparait dans la liste

  Scenario: Ajouter plantation et traitement sur une parcelle
    When j'ouvre l'application
    And je vais sur la parcelle "Parcelle Nord"
    And j'ajoute une plantation "Tournesol" du "2026-03-10" sur 1.5 ha
    And j'ajoute un traitement "Insecticide" du "2026-03-12" dose "0.7 L/ha"
    Then la plantation "Tournesol" est visible
    And le traitement "Insecticide" est visible
