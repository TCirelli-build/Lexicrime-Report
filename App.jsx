/**
 * LexiCrime Officer Report Assistant
 * Copyright (c) 2026. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL
 * This software is the exclusive property of the Owner.
 * Unauthorized use, reproduction, or distribution is strictly prohibited.
 * See LICENSE file for full terms.
 *
 * For authorized use by Massachusetts Environmental Police
 * and designated Authorized Agency personnel only.
 */

import { useState, useRef, useEffect } from "react";

// ─── LAW DATABASE (embedded as AI system context) ────────────────────────────
const LAW_DATABASE = `STATUTE: 16 U.S.C. § 1857 (MSA)
CHARGE: Magnuson-Stevens Fishery Conservation and Management Act — Illegal Fishing
ELEMENTS: (1) Fished within the U.S. Exclusive Economic Zone (200 nm) (2) In violation of a fishery mana...(3) Includes overfishing quotas, closed-area violations, gear restrictions, and false reportin...(4) Knowing or negligent violation depending on charge
---
STATUTE: 16 U.S.C. § 1538 (ESA § 9)
CHARGE: Endangered Species Act — Unlawful Take of Listed Marine Species
ELEMENTS: (1) Took (harassed, harmed, pursued, hunted, killed, captured, or collected) (2) A species lis...(3) Within U.S. jurisdiction or by a U.S. national on the high seas (4) No valid incidental ta...
---
STATUTE: 16 U.S.C. § 1372 (MMPA)
CHARGE: Marine Mammal Protection Act — Unlawful Take of Marine Mammal
ELEMENTS: (1) Took (hunted, harassed, captured, or killed) (2) A marine mammal (whale, dolphin, porpoise...(3) In U.S. waters or by a U.S. citizen on the high seas (4) Without an applicable permit, sci...
---
ST...(Lacey Act)
CHARGE: Lacey Act — Trafficking in Illegally Taken Fish or Wildlife
ELEMENTS: (1) Imported, exported, transported, sold, received, acquired, or purchased (2) Fish, wildlife...(3) Taken, possessed, or sold in violation of any underlying federal, state, foreign, or triba...(4) Knowingly engaged in the prohibited conduct (felony) or with lesser culpability (misdemean...
---
STATUTE: 16 U.S.C. § 1437 (NMSA)
CHARGE: National Marine Sanctuaries Act — Injury to Sanctuary Resource
ELEMENTS: (1) Destroyed, caused the loss of, or injured a sanctuary resource (2) Within a designated Nat...(3) Through discharge, vessel grounding, anchoring, or prohibited commercial take (4) Without ...
---
STATUTE: 16 U.S.C. § 1826d et seq.
CHARGE: High Seas Driftnet Fishi...
ELEMENTS: (1) Engaged in large-scale driftnet fishing on the high seas, OR (2) Engaged in illegal, unrep...(IUU) fishing (3) As identified under NOAA's biennial Report to Congress (4) Bycatch of protected living mar...
---
STATUTE: 16 U.S.C. § 18...(1)(P)
CHARGE: Shark Conservation Act — Shark Finning Violation (Federal)
ELEMENTS: (1) Removed shark fins at sea and discarded the carcass (finning), OR (2) Possessed shark fins...(3) In violation of MSA shark conservation provisions
---
STATUTE: 16 U.S.C. § 5103 et seq.
CHARGE: Atla...
ELEMENTS: (1) Fished in state or federal Atlantic coastal waters (2) In violation of an interstate fishe...(e.g., ASMFC plans) (3) After the Secretary of Commerce found the state out of compliance, or in violation of a mo...
-...
STATUTE: 16 U.S.C. §§ 2431–2444 (AMLRCA)
CHARGE: Antarctic Marine Living Resources Convention Act Violations
ELEMENTS: (1) Engaged in harvesting or fishing for Antarctic marine living resources (2) In violation of...(3) Without proper documentation or vessel monitoring compliance
---
STATUTE: 50 C.F.R. § 648 Subpart F ...(under 16 U.S.C. § 1801 et seq.)
CHARGE: Northeast Multispecies (Groundfish) Violations
ELEMENTS: (1) Fished for regulated groundfish species (cod, haddock, yellowtail flounder, pollock, witch...(2) In violation of days-at-sea (DAS) allocations, sector/common-pool catch limits, minimum me...(3) Without a valid federal groundfish permit, or in violation of vessel trip reporting (eVTR)...(VMS) requirements
---
STATUTE: 50 C.F.R. § 648 Subpart D
CHARGE: Atlantic Sea Scallop Fishery Violations
ELEMENTS: (1) Fished for Atlantic sea scallops in federal waters (Maine to North Carolina EEZ) (2) In a ...(3) In violation of days-at-sea, individual fishing quota (IFQ), or crew/possession limits for...
---
STATUTE: 50 C.F.R. § 648 Subpart K
CHARGE: Atlantic Herring Fishery Violations
ELEMENTS: (1) Fished for Atlantic herring in the management area (2) In violation of sub-ACL allocations...(3) Including unauthorized at-sea transfers or operational discard violations
---
STATUTE: 50 C.F.R. § 6...(American Lobster)
CHARGE: American Lobster Fishery Violations
ELEMENTS: (1) Fished for or possessed American lobster in federal waters (2) In violation of minimum/max...(3) Possession of egg-bearing (berried) females or v-notched lobster
---
STATUTE: 50 C.F.R. § 648 Subparts G, H, I
CHARGE: Summer Flounder, Scup & Black Sea Bass Violations
ELEMENTS: (1) Fished for summer flounder, scup, or black sea bass in federal waters (2) In violation of ...(3) Without a valid moratorium/limited access permit where required
---
STATUTE: M.G.L. c. 265, § 1
CHAR...(First Degree)
ELEMENTS: (1) Unlawful killing of a human being (2) With deliberately premeditated malice aforethought, ...(3) By means of poison, lying in wait, or other willful, deliberate, premeditated killing, OR ...(4) In commission of a crime punishable by death or life imprisonment (felony murder)
---
STATUTE: M.G.L. c. 265, § 13A
CHARGE: Assault & Battery
ELEMENTS: (1) Intentional, unjustified touching of another person (2) Without consent (3) The touching w...
---
STATUTE: M.G.L. c. 265, § 15A
CHARGE: Assault & Battery wi...
ELEMENTS: (1) Committed an assault and battery upon another person (2) By means of a dangerous weapon (3...
---
STATUTE: M.G.L. c. 266, § 30
CHARGE: Larceny Over $1,200
ELEMENTS: (1) Stole, embezzled, or obtained by false pretenses (2) Property belonging to another (3) Wit...(4) Value exceeding $1,200
---
STATUTE: M.G.L. c. 266, § 16
CHARGE: Breaking & Entering (Nighttime)
ELEMENTS: (1) Broke and entered into a building, ship, vessel, or vehicle (2) In the nighttime (3) With ...
---
STATUTE: M.G.L. c. 265, § 17
CHARGE: Armed Robbery
ELEMENTS: (1) Assaulted another person (2) With intent to rob, steal, or purloin (3) Was armed with a da...(4) Inflicted bodily injury
---
STATUTE: M.G.L. c. 90, § 24
CHARGE: OUI / DUI (Operating Under the Influence)
ELEMENTS: (1) Operated a motor vehicle (2) Upon a public way, or in a place where public has right of ac...(3) While under the influence of intoxicating liquor, marijuana, or controlled substance, OR (...
---
STATUTE: M.G.L. c. 94C, § 32
CHARGE: Drug Possession with Intent to...
ELEMENTS: (1) Knowingly or intentionally possessed (2) A controlled substance (3) With intent to manufac...(4) Knowledge that the substance was a controlled substance
---
STATUTE: M.G.L. c. 209A, § 7
CHARGE: Res...
ELEMENTS: (1) A valid abuse prevention order was in effect (2) Defendant had knowledge of the order (3) ...(4) No requirement to prove intent to violate — strict liability
---
STATUTE: M.G.L. c. 265, § 15D
CHARG...
ELEMENTS: (1) Intentionally interfered with the normal breathing or circulation of blood (2) Of another ...(3) By applying pressure on the throat or neck, OR (4) By blocking the nose or mouth
---
STATUTE: M.G.L. c. 269, § 10(a)
CHARGE: Unlicensed Firearm Carrying
ELEMENTS: (1) Carried a firearm (2) Outside one's home or place of business (3) Without a valid License ...(LTC)
---
STATUTE: M.G.L. c. 272, § 53 / Local Ordinance
CHARGE: Noise Ordinance Violation
ELEMENTS: (1) Created or caused excessive noise (2) In a public place or affecting public peace (3) With...(4) Noise exceeded permissible decibel levels or occurred during prohibited hours
---
STATUTE: M.G.L. c....
CHARGE: Alcohol Sales to Minors
ELEMENTS: (1) Sold, delivered, or gave (2) An alcoholic beverage (3) To a person under 21 years of age (...(strict liability for licensees)
---
STATUTE: M.G.L. c. 21C, § 9
CHARGE: Improper Disposal of Hazardous Waste
ELEMENTS: (1) Disposed, stored, treated, or transported (2) Hazardous waste (3) Without a valid license ...(4) In a manner inconsistent with regulations or permit conditions
---
STATUTE: M.G.L. c. 93, § 29
CHARG...
ELEMENTS: (1) Operated a business or trade (2) Required by law to obtain a license or permit (3) Without...(4) Within the Commonwealth of Massachusetts
---
STATUTE: M.G.L. c. 272, § 59
CHARGE: Open Container / P...
ELEMENTS: (1) Possessed an open container of alcohol (2) In or on a public way, park, or recreation area...(3) Without authorization from local licensing authority
---
STATUTE: M.G.L. c. 266, § 120
CHARGE: Tresp...
ELEMENTS: (1) Entered or remained upon land or in a building (2) Without authorization or right to be th...(3) After being forbidden to do so by the owner or occupant, OR (4) After posted notice prohib...
---
STATUTE: M.G.L. c. 90, § 13B
CHARGE: Distracted Driving (Handheld Device)
ELEMENTS: (1) Operated a motor vehicle (2) On a public way (3) While using a handheld mobile electronic ...(4) Unless using hands-free mode
---
STATUTE: M.G.L. c. 130, § 67
CHARGE: Illegal Taking/Possession of S...
ELEMENTS: (1) Took or disturbed shellfish (2) From licensed grounds or beds (3) Without consent of the l...(4) No requirement of commercial purpose
---
STATUTE: M.G.L. c. 130, § 68
CHARGE: Digging/Taking Shellfi...
ELEMENTS: (1) Dug, took, or carried away shellfish (2) From licensed waters, flats, or creeks (3) During...(4) Without authorization of licensee
---
STATUTE: M.G.L. c. 130, § 69
CHARGE: Taking Seed Quahogs, Clam...
ELEMENTS: (1) Took or had in possession (2) Seed quahogs, clams, or oysters (3) Below the legal minimum ...(4) Without an applicable permit or exemption
---
STATUTE: M.G.L. c. 130, § 80
CHARGE: Commercial/Recrea...
ELEMENTS: (1) Fished for or took fish for commercial purposes (2) In coastal waters of the Commonwealth ...(3) Without a valid commercial permit or certificate (4) Outside exemptions under §§ 38 or 75
---
STATUTE: M.G.L. c. 130, § 17C / § 17D
CHARGE: Recreational ...
ELEMENTS: (1) Engaged in recreational saltwater fishing (2) In Massachusetts coastal waters (3) Without ...(4) Not within an exempted category (minors, seniors, some shore fishing)
---
STATUTE: M.G.L. c. 130, § 100A / § 100B
CHARGE: Striped Bass Violations
ELEMENTS: (1) Took, possessed, or sold striped bass (2) In violation of size, season, or bag limit regul...(3) Or used a prohibited method/trap for taking striped bass
---
STATUTE: M.G.L. c. 130, §§ 70–72
CHARGE...
ELEMENTS: (1) Took or sold scallops (2) Outside the established open season (3) Or exceeded catch limita...(4) Or took undersized/seed scallops without authorization
---
STATUTE: M.G.L. c. 130, § 23
CHARGE: Disc...
ELEMENTS: (1) Discharged oil or another poisonous/deleterious substance (2) Into coastal waters (3) Or u...(4) Resulting in actual or potential harm to fish/marine life
---
STATUTE: M.G.L. c. 130, § 106
CHARGE: ...(Finning Prohibition)
ELEMENTS: (1) Possessed, sold, offered for sale, traded, or distributed (2) Shark fins (3) Detached from...(4) Without qualifying for a statutory exception
---
STATUTE: M.G.L. c. 130, § 18
CHARGE: Illegal Entry ...
ELEMENTS: (1) Entered without right (2) Upon land, flats, or water (3) Set apart and used for fish exper...(4) Posted or otherwise designated as restricted
---
STATUTE: M.G.L. c. 131, § 11
CHARGE: Hunting/Fishin...
ELEMENTS: (1) Hunted, fished, or trapped (2) Within the Commonwealth (3) Without a valid license require...(4) Not falling within a statutory exemption (e.g., minors under 15 fishing)
---
STATUTE: M.G.L. c. 131, § 90
CHARGE: General Penalty Violations (Fish/Game Code)
ELEMENTS: (1) Violated any enumerated section of c.131 (e.g., §§5, 10, 11, 30, 35–36, 38, 47, 49–51, 53–...(2) Took, possessed, or sold protected fish, birds, or mammals in violation of the chapter (3)...
---
STATUTE: M.G.L. c. 131, § 5C
CHAR...
ELEMENTS: (1) Intentionally drove, disturbed, or blocked another's lawful taking of fish/wildlife (2) Us...(3) Entered/remained on land with intent to violate the section
---
STATUTE: M.G.L. c. 131, § 58
CHARGE:...
ELEMENTS: (1) Discharged a firearm or hunted (2) Upon or across a public highway, OR (3) Within 150 feet...
---
STATUTE: M.G.L. c. 131, § 63
CHARGE: Loade...
ELEMENTS: (1) Possessed a loaded shotgun or rifle (2) In or on a motor vehicle, aircraft, or motorboat (...
---
STATUTE: M.G.L. c. 131, § 65
CHARGE: Huntin...
ELEMENTS: (1) Hunted wildlife (2) From within or upon a motor vehicle, snowmobile, aircraft, or watercra...(3) Outside exemptions for persons with disabilities under specific permit provisions
---
STATUTE: M.G.L...
CHARGE: Failure to Display Fish/Game/Equipment for Inspection
ELEMENTS: (1) Was reasonably believed to be hunting, fishing, or trapping (2) Or unlawfully in possessio...(3) Refused or failed to display items for inspection upon lawful request by an Environmental ...
---
STATUTE: M.G.L. c. 131, § 26
CHARGE: Unlawful Importation of Fish/Birds/Mammals/Reptiles
ELEMENTS: (1) Imported fish, birds, mammals, reptiles, or amphibians (2) Into the Commonwealth (3) Witho...(4) Or in violation of disease inspection requirements
---
STATUTE: M.G.L. c. 131A, § 2
CHARGE: Endanger...
ELEMENTS: (1) Took, possessed, transported, or sold (2) A plant or animal species listed as endangered, ...(3) Or knowingly violated a habitat protection provision (4) Listed in the official MESA speci...
---
STATUTE: M.G.L. c. 131A, § 6
CHARGE: Significant Habita...(MESA)
ELEMENTS: (1) Altered or destroyed a designated significant habitat (2) Of an endangered, threatened, or...(3) Without an applicable conservation/management permit (4) Court may order restoration at vi...
---
STATUTE: M.G.L. c. 90B, § 21
CHARGE: Unregiste...(OHV/ATV/Snowmobile)
ELEMENTS: (1) Operated a snow vehicle or recreation vehicle (ATV, dirt bike, snowmobile, etc.) (2) That ...(3) Outside the exemption for operation solely on land owned by the operator
---
STATUTE: M.G.L. c. 90B,...
CHARGE: OUI – Snow or Recreation Vehicle
ELEMENTS: (1) Operated a snow vehicle or recreation vehicle (2) While under the influence of alcohol or ...(3) On any way, land, or water within the Commonwealth
---
STATUTE: M.G.L. c. 90B, § 26B
CHARGE: Neglige...
ELEMENTS: (1) Operated a snow vehicle or recreation vehicle in a negligent or reckless manner (2) Endang...(3) Left the scene of an accident involving such vehicle (4) Resulting in serious bodily injur...(aggravated penalty tier)
---
STATUTE: M.G.L. c. 90B, § 26
CHARGE: Underage Operation of ATV/Recreation Vehicle
ELEMENTS: (1) Person under 14 operated an ATV or recreation utility vehicle, OR (2) Person 14–16 operate...(3) Outside sanctioned race/rally/event exemptions
---
STATUTE: M.G.L. c. 90B, § 33
CHARGE: Local/Depart...(Snowmobile)
ELEMENTS: (1) Operated a snowmobile upon the land of another (2) Failed to stop and identify himself upo...(3) Failed to promptly remove the snowmobile from the premises when so requested (4) Note: §§2...
---
STATUTE: M.G.L. c. 90B, § 26(c) / § 38
CHARGE: Failure to Stop for Law Enforcement / Refusal to Identify (OHV)
ELEMENTS: (1) Operating or in control of a snow/recreation vehicle (2) Refused to stop after signal from...(3) Refused to give correct name, address, and registration number
---
STATUTE: M.G.L. c. 90B, § 8
CHARG...(OUI – Vessel)
ELEMENTS: (1) Operated a vessel (2) Upon waters within the Commonwealth's jurisdiction (3) While under t...(4) Includes enhanced penalties if causing serious bodily injury (§8A) or death (§8B)
---
STATUTE: M.G.L. c. 270, § 16
CHARGE: Littering — Public or Private Property
ELEMENTS: (1) Threw, dumped, or deposited waste material (trash, garbage, debris) (2) Onto public or pri...(3) Including disposal of waste thrown from a vehicle (4) Knowingly committed the act
---
STATUTE: M.G.L. c. 90, § 22G
CHARGE: Littering from Motor Vehicle — ...
ELEMENTS: (1) As operator, littered or knowingly permitted occupants to litter (2) Public or private pro...(3) Through disposal of trash/garbage from the motor vehicle (4) Subject to RMV hearing and li...
---
STATUTE: M.G.L. c. 272, § 77
CHARGE: ...
ELEMENTS: (1) Overdrove, overloaded, tortured, mutilated, or killed an animal, OR (2) As custodian, fail...(3) Willfully abandoned an animal (4) Knowingly permitted unnecessary cruelty
---
STATUTE: M.G.L. c. 90, § 24
CHARGE: Operating Under the ...(OUI)
ELEMENTS: (1) Operated a motor vehicle (2) Upon a public way or place where the public has a right of ac...(3) While under the influence of alcohol, marijuana, or a controlled substance, OR with BAC ≥ ...
---
S...
CHARGE: Operating Without a License / Suspended License
ELEMENTS: (1) Operated a motor vehicle on a public way (2) Without ever having been licensed, OR (3) Whi...(4) Knowledge of suspension/revocation required for §23 violation
---
STATUTE: M.G.L. c. 90, § 17 / § 24...(2)(a)
CHARGE: Speeding / Reckless or Negligent Operation
ELEMENTS: (1) Operated a motor vehicle at a rate of speed greater than reasonable/proper, OR (2) Operate...(3) Operated negligently so that the lives/safety of the public might be endangered
---
STATUTE: M.G.L. ...(2)(a½) / § 24L
CHARGE: Leaving the Scene of an Accident (Property Damage / Personal Injury)
ELEMENTS: (1) Operated a motor vehicle involved in a collision (2) Causing injury to a person or damage ...(3) Knew or should have known of the collision (4) Failed to stop and provide information/rend...
---
STATUTE: M.G.L. c. 90, § 25
CHARGE: Failure to...
ELEMENTS: (1) Operator of a motor vehicle (2) Failed to stop when signaled by a police or environmental ...(3) Officer was authorized to direct/control traffic or enforce motor vehicle law
---
STATUTE: M.G.L. c....
CHARGE: Equipment Violations (Lights, Brakes, Muffler, Registration Display)
ELEMENTS: (1) Operated a motor vehicle (2) Lacking required equipment (lights, brakes, muffler, mirrors)...(3) In violation of equipment standards set by the Registrar
---
STATUTE: M.G.L. c. 90, § 9 / § 34J
CHAR...
ELEMENTS: (1) Operated or permitted operation of a motor vehicle (2) Not registered as required, OR (3) ...
---
STATUTE: M.G.L. c. 90B, § 2
CHARG...
ELEMENTS: (1) Maintained, operated, or suffered/permitted operation of a motorboat (2) On the waters of ...(3) Without the motorboat being numbered in accordance with c.90B (4) Not falling within an en...(foreign-owned, government-owned, lifeboat, reciprocal out-of-state number, documented vessel)
---
STATUTE: M.G.L. c. 90B, § 3
CHARGE: Failure to Display/Maintain Certificate of Number
ELEMENTS: (1) Displayed an identification number on a vessel (2) Without holding a valid certificate of ...(3) Displayed a number other than the one awarded to the motorboat (4) Failed to keep certific...
---
STATU...
CHARGE: Forging/Altering/Counterfeiting Certificate of Number
ELEMENTS: (1) Falsely made, altered, forged, or counterfeited a certificate of number, OR (2) Forged or ...(3) Possessed, uttered, or published as true a falsely made/altered/forged certificate
---
STATUTE: M.G....
CHARGE: Removing/Defacing Motorboat or Motor Identification Number
ELEMENTS: (1) Removed, defaced, altered, changed, destroyed, obliterated, or mutilated the manufacturer'...(2) With intent to conceal the identity of the motorboat, motor, or engine (3) Possession of a...
---
ST...
CHARGE: Motorboat Equipment Violations (Lighting, PFDs, Fire Extinguishers, Whistle/Bell)
ELEMENTS: (1) Operated or permitted operation of a motorboat (2) Not equipped as required by class (ligh...(3) Outside exceptions for boats engaged in approved racing/tuning
---
STATUTE: M.G.L. c. 90B, § 5A
CHAR...
ELEMENTS: (1) Operated a vessel not subject to § 5 (e.g., canoe, kayak, stand-up paddleboard) (2) Withou...(3) Amphibious landing vehicles: failed to carry a PFD for each passenger under 10
---
STATUTE: M.G.L. c...
CHARGE: Non-Compliant Fuel Dispensing Nozzle (Marina)
ELEMENTS: (1) Operated a pump or dispensing device providing motor fuel for motorboats (2) Without an au...(3) With a nozzle capable of being locked into an open position
---
STATUTE: M.G.L. c. 90B, § 5C
CHARGE:...
ELEMENTS: (1) Discharged sewage from a vessel (2) Into waters designated by the Commonwealth as a no-dis...(3) Without an applicable exemption
---
STATUTE: M.G.L. c. 90B, § 5D
CHARGE: Violation of Toxic Vapor/Qu...(c.21 § 37B)
ELEMENTS: (1) Violated subsection (g) of M.G.L. c.21 § 37B, or any rule/regulation/order/quarantine prom...(2) Relating to vessel quarantine or contamination control measures
---
STATUTE: M.G.L. c. 90B, § 6
CHAR...
ELEMENTS: (1) Operated a motorboat with an internal combustion engine (2) Exhaust not effectively muffle...(3) Used a cutout outside the narrow exception for boats in approved races/trial runs
---
STATUTE: M.G.L...
CHARGE: Boat Livery Renting Non-Compliant Motorboat
ELEMENTS: (1) As owner, agent, or employee of a boat livery (2) Permitted a motorboat/vessel to depart t...(3) Without the equipment required under § 5 or applicable director regulations
---
STATUTE: M.G.L. c. 9...
CHARGE: Vessel OUI (Controlled Substance) Causing Serious Bodily Injury
ELEMENTS: (1) Operated a vessel on Commonwealth waters with BAC ≥ .08%, or under the influence of liquor...(2) Operated recklessly or negligently so the lives/safety of the public might be endangered (...(substantial risk of death, or total/substantial loss of bodily function)
---
STATUTE: M.G.L. c. 90B, § 8B
CHARGE: Vessel Homicide (OUI Controlled Substance Causing Death)
ELEMENTS: (1) Operated a vessel under the influence (BAC ≥ .08% or liquor/drugs/toxic vapors) (2) Operat...(3) Caused the death of another person
---
STATUTE: M.G.L. c. 90B, § 9
CHARGE: Failure to Render Aid / R...
ELEMENTS: (1) Operator involved in a motorboat collision/accident/casualty (2) Failed to render practica...(3) Failed to give name/address/vessel ID to injured persons or property owners, OR (4) Failed...(death) or 5 days (other) of incident involving death, injury, or damage >$500
---
STATUTE: M.G.L. c. 90B, § 9A
CHARGE: Jet Ski / Personal Watercraft Operating Restrictions
ELEMENTS: (1) Operated a jet ski, surf jet, or wetbike (2) By a person under 16, OR within 150 ft of swi...
---
STATUTE: M.G.L. c. 90B, § 9E
CHARGE: Operating Without Boater Safety Certificate
ELEMENTS: (1) Operated a motorboat or personal watercraft on Commonwealth waters (2) Without complying w...(3) Not falling within enumerated exceptions (supervised by certified adult, merchant mariner ...(4) Operator under 12: vessel operated without direct supervision by a certified person 18+
---
STATUTE:...
CHARGE: Overloaded or Unsafe Motorboat Operation
ELEMENTS: (1) Operated a motorboat without required personal flotation devices, OR (2) Operated a motorb...(3) Operated a motorboat in an otherwise unsafe condition
---
STATUTE: M.G.L. c. 90B, § 13A
CHARGE: Scub...
ELEMENTS: (1) Engaged in scuba diving in Commonwealth waters (2) Failed to display the required diver's ...(3) Note: boat operators must also avoid close-approach to a displayed diver's flag per implem...
---
STATUTE: M.G.L. c. 90B, § 22A
CHARGE: Improper Vintage Snow Vehicle Registration/Use
ELEMENTS: (1) Registered or operated a snow vehicle under the vintage classification (2) Vehicle does no...(3) Used beyond the authorized purposes (exhibitions, parades, public events, occasional perso...(4) Vehicle does not meet sound/emission specs in effect at time of manufacture
---
STATUTE: M.G.L. c. 9...
CHARGE: Failure to Report Transfer of Snow/Recreation Vehicle Ownership
ELEMENTS: (1) Transferred ownership of a snow vehicle or recreation vehicle (2) Failed to forward writte...(3) New owner failed to apply for registration as required
---
STATUTE: M.G.L. c. 90B, § 24
CHARGE: Snow...
ELEMENTS: (1) Operated a snow vehicle or recreation vehicle (2) Lacking required headlight(s), red rear ...(3) Emitting noxious fumes or unusual/excessive noise, OR (4) Exceeding 96 dB (post-1998 manuf...(pre-1998) at 20 inches per SAE J1287 test standard (5) Outside the exception for vehicles on a privately-owned track/closed course
---
STATUTE: M.G.L. c. 9...
CHARGE: Permitting Underage/Unauthorized Operation of Snow/Recreation Vehicle
ELEMENTS: (1) As a person 18+ with custody/control of a snow or recreation vehicle (2) Knowingly permitt...(3) Resulting in damages, injuries, fines, or penalties — joint and several liability attaches...(4) Lack of ownership or mistake as to operator's age is not a defense
---
STATUTE: M.G.L. c. 90B, § 27
...
ELEMENTS: (1) Operator/owner of a snow or recreation vehicle involved in a collision/accident/casualty (...(3) Failed to immediately notify a law enforcement officer, OR failed to file a written report...
---
STATUTE: M.G.L. c. 130, § 25
CHARGE: Dis...
ELEMENTS: (1) Caused or allowed entrance/discharge into coastal waters or tributaries (2) Of sewage or a...(3) Not falling within pre-1942 approved drainage rights or properly permitted heated effluent...
---
STATUTE: M.G.L. c. 130, § 27
CHARGE: Criminal/Tort Liability for Sewage Discharge Into Coastal Waters
ELEMENTS: (1) Violated § 25 (prohibited discharge of sewage/injurious substance into coastal waters) (2)...
---
...
CHARGE: Unauthorized Construction of Weir, Pound Net, or Fish Trap
ELEMENTS: (1) Constructed or maintained a weir, pound net, or fish trap in tidewater (2) Without written...(3) Without written approval as to location/construction from the department and director on f...
---
STATUTE: M.G.L. c. 130, § 37
C...
ELEMENTS: (1) Caught, took, or landed lobsters or edible crabs in/from coastal waters, OR (2) Placed, se...(3) Without a license issued under § 38 (4) Took lobsters by spearing, dipping, or dragging (c...
---
STATUTE: M.G.L. c. 130, § 38
CHARGE: Lobster/Crab License Violations (Buoy Marking, Trap Limits, Exhibition)
ELEMENTS: (1) Held a noncommercial lobster/crab permit but exceeded 10 traps, sold catch, or fished outs...(2) Failed to mark buoys/pots/traps/lobster cars with approved color scheme and assigned licen...(3) Used wooden lobster buoys after Jan. 1, 1974, OR (4) Failed to exhibit permit upon demand ...(5) Possession of gear with removed/altered/defaced license number is prima facie evidence of ...
...
STATUTE: M.G.L. c. 130, § 41A
CHARGE: Stripping/Possessing Stripped Female Egg-Bearing Lobster
ELEMENTS: (1) Took, sold, or possessed a female lobster (2) From which eggs had been removed by means ot...(3) Detection of egg-removal substance or physical evidence of artificial egg removal is prima...
---
STATUTE: M.G.L. c. 130, § 44B
CHARGE: Excess Landing of Non-Pot/Trap Lobsters
ELEMENTS: (1) Commercial fishing vessel landed lobsters taken by a method other than pots or traps (2) L...(3) Subject to supersession by applicable federal/interstate lobster management plans
---
STATUTE: M.G.L...
CHARGE: Failure to Mark Lobster/Lobster Meat Containers
ELEMENTS: (1) Delivered to a carrier, or transported, a barrel/box/container of lobsters or lobster meat...(2) Without marking it 'Lobsters' or 'Lobster Meat' in 1-inch capital letters with shipper's n...(3) For lobster meat: without the permit number under which it was removed from the shell
---
STATUTE: M...
CHARGE: Carrier Knowingly Transporting Unmarked Lobster Containers
ELEMENTS: (1) As a carrier, knowingly received or carried (2) Lobster or lobster meat in barrels, boxes,...(3) Not marked as required under § 47
---
STATUTE: M.G.L. c. 13...
CHARGE: False Representation in Sale of Crabmeat
ELEMENTS: (1) Sold or offered for sale crabmeat (2) Made false representations as to species, origin, or...(3) In violation of labeling/representation requirements of this section
---
STATUTE: M.G.L. c. 130, § 5...
CHARGE: Illegal Commercial Taking of Eels/Shellfish/Sea Worms in Prohibited Areas
ELEMENTS: (1) Took eels, shellfish, or sea worms for commercial purposes (2) In an area where commercial...(3) Without an applicable permit or exemption
---
STATUTE: M.G.L. c. ...
CHARGE: Unlicensed Commercial Shellfish Taking by Non-Resident/Alien
ELEMENTS: (1) As a non-citizen/alien (2) Took shellfish for commercial purposes (3) Without the specific...
---
STATUT...
CHARGE: Destruction/Removal of Shellfish License Boundary Marks
ELEMENTS: (1) Destroyed or removed marks or bounds (2) Designating the boundaries of a licensed shellfis...(3) Without authorization from the licensee or director
---
STATUTE: M.G.L. c. 130, § 75
CHARGE: Unautho...
ELEMENTS: (1) Took shellfish from an area designated as contaminated under § 74/§74A (2) Without a valid...(3) Sold or distributed shellfish from a contaminated area without required purification
---
STATUTE: M....
CHARGE: Unauthorized Importation of Shellfish for Consumption
ELEMENTS: (1) Imported shellfish into the Commonwealth for consumption (2) Without the required certific...(3) Without proper labeling of containers as required
---
STATUTE: M.G.L. c. 130, ...
CHARGE: Scallop Sale/Marking Violations (Soaked or Shucked Scallops)
ELEMENTS: (1) Sold, soaked, or possessed scallops not in shell (2) Without proper marking of containers ...(3) Common carrier transported improperly marked scallop containers
---
STATUTE: M.G.L. c. 1...
CHARGE: Illegal Shad Taking Methods
ELEMENTS: (1) Took shad (2) By a method not authorized under this section's prescribed methods (3) Outsi...
---
STATUTE: M.G.L. c. 130, § 101A
CHARGE: Har...
ELEMENTS: (1) Took, harassed, hunted, captured, or killed a gray seal (2) Within Commonwealth jurisdicti...(3) Without a valid scientific or other authorized permit (note: gray seals are also independe...
---
STATUTE: M.G.L. c. 130, § 17B
CHARGE: Unpermitted ...
ELEMENTS: (1) Operated an aquacultural enterprise (commercial cultivation of marine species) (2) In coas...(3) Without the permit required under this section
---
STATUTE: M.G.L. c. 130, § 43
CHARGE: Insufficient Identification on Lobster Pots (Egg-Bearing Lobster Conditions)
ELEMENTS: (1) Took or possessed egg-bearing lobsters outside the narrow conditions authorized by this se...(e.g., licensed propagation/rearing purposes) (2) Failed to comply with conditions for disposition of such lobsters set by the director
---
STATUTE: M...
CHARGE: Operating Without Proper Permit Form/Record
ELEMENTS: (1) Held or claimed a shellfish permit (2) Permit was not in the form prescribed by the direct...(3) Engaged in licensed activity based on a defective or unrecorded permit
---
STATUTE: M.G.L. c. 130, §...
CHARGE: Shellfish License Issued Without Required Hearing/Notice
ELEMENTS: (1) Applied for or obtained a shellfish grounds license (2) Without the survey/plan applicatio...(3) Without the public hearing and notice/publication required under § 60
---
STATUTE: M.G.L. c. 130, § ...
CHARGE: Hunting/Disturbing Wildlife on Fish Propagation Grounds
ELEMENTS: (1) Entered upon land/water set apart for fish propagation/experimentation (2) Took, hunted, o...(3) Without director authorization
---
STATUTE: M.G.L. c. 130, §§ 74, 74A
CHARGE: Violation of Contamina...
ELEMENTS: (1) Took shellfish from an area determined/emergency-designated as contaminated by the directo...(2) After notice of results/emergency designation was issued (3) Without an applicable relay o...
---
STATUTE: M.G.L. c. 130, §§ 93-94
C...
ELEMENTS: (1) Interfered with the operation of a municipally-controlled alewife/herring fishery establis...(2) Or unlawfully opened/obstructed ditches or canals established for herring/alewife propagat...(3) Without authorization from the controlling municipality
---
STATUTE: M.G.L. c.132A §11 / DCR...
CHARGE: Trespass on DCR Land
ELEMENTS: (1) Entered or remained on DCR-managed land or facility (2) After being forbidden to do so, or...(3) Without valid permit or authorization
---
STATUTE: 302 CMR 12.00
CHARGE: DCR Park Regulation Violati...
ELEMENTS: (1) Violated DCR park rules/regulations on state-managed land (2) Including prohibited activit...(fires, alcohol, camping, ORV use outside designated areas)
---
STATUTE: M.G.L. c.132A / 302 CMR 12.00
CHARGE: Hunting/Shooting in State Park Without Authorization
ELEMENTS: (1) Discharged firearm or hunted on DCR-managed land (2) Without valid DCR hunting permit or o...
---
STATUTE: M.G.L. c.270 §16 /...
CHARGE: Littering/Dumping on State Lands
ELEMENTS: (1) Deposited refuse, waste, or debris on DCR-managed land (2) Without authorization
---
STATUTE: M.G.L. c.266 §126A / 302 CMR 12.00
CHARGE: Vandalism/Destruction ...
ELEMENTS: (1) Damaged, defaced, or destroyed DCR property or natural resources (2) On state-managed land...
---
STATUTE: 302 CMR 12.00 / M.G.L. c.90B §26
CHARGE: Unauthorized ORV/ATV Use...
ELEMENTS: (1) Operated off-road vehicle on DCR-managed land (2) Outside designated ORV areas or without ...
---
STATUTE: 302 CMR 12.00
CHARGE: Illegal C...
ELEMENTS: (1) Camped or erected shelter on DCR land (2) Without a valid camping permit or outside design...
---
STATUTE: 302 CMR 12.00
CHARG...
ELEMENTS: (1) Conducted commercial, sales, or vending activity on DCR land (2) Without a valid DCR comme...
---
STATUTE: 16 U.S.C. §§ 703-712 (MBTA)
CHARGE: Migratory Bird Treaty Act — Unlawful Take of Migratory Bird
ELEMENTS: (1) Pursued, hunted, took, captured, killed, possessed, sold, purchased, bartered, imported, e...(2) Any migratory bird, or any part/nest/egg of any such bird (3) Listed under the MBTA (1,100...(4) Without a valid federal permit issued by USFWS (5) Note: strict liability for misdemeanor ...
---
STATUTE: 16 U.S.C. §§ 66...(BGEPA)
CHARGE: Bald and Golden Eagle Protection Act — Unlawful Take/Possession of Eagle
ELEMENTS: (1) Took, possessed, sold, purchased, bartered, offered to sell/purchase/barter, transported, ...(2) Any bald eagle or golden eagle, alive or dead (3) Including any part, nest, or egg of such...(4) Without a permit issued by the Secretary of the Interior (5) Disturbing an eagle constitut...
---
STATUTE: 16 U.S.C. §§ 7...(Fish and Wildlife Act of 1956)
CHARGE: Fish and Wildlife Act — Unlawful Taking/Sale of Fish or Wildlife
ELEMENTS: (1) Imported, exported, transported, sold, received, acquired, or purchased (2) Fish or wildli...(3) Taken, possessed, transported, or sold in violation of any applicable law or regulation (4...
---
STATUTE: 16 U.S.C. §§ 1531-1543 (ESA) / 50 CFR Part 17 (USFWS listed species)
CHARGE: ESA — Unlawful Take of Terrestrial Listed Species (USFWS jurisdiction)
ELEMENTS: (1) Took (harassed, harmed, pursued, hunted, shot, wounded, killed, trapped, captured, or coll...(2) A species listed as endangered or threatened under the ESA within USFWS jurisdiction (3) I...(4) Without an incidental take permit, safe harbor agreement, or other valid ESA authorization...
---
STATU...(Migratory Bird Hunting)
CHARGE: Migratory Bird Hunting Violation — Season/Limit/Method
ELEMENTS: (1) Hunted migratory game birds (waterfowl, doves, woodcock, snipe, etc.) (2) Outside the fede...(3) Using prohibited methods (unplugged shotgun, live decoys, bait, electronic calls for water...(4) Without a valid federal duck stamp and state license where required
---
STATUTE: 50 CFR Part 21 (Migratory Bird Permits)
CHARGE: Unlicensed Falconry / Raptor Possession
ELEMENTS: (1) Possessed, transported, or used a raptor for falconry (2) Without a valid state/federal fa...(3) Captured a raptor from the wild without a valid capture permit (4) Failed to comply with f...
---
STATUTE: 320 CMR 2.00 (OFBA Public Access Facilities Regulations)
CHARGE: OFBA Public Access Facility — Unauthorized Use or Prohibited Activity
ELEMENTS: (1) Used an OFBA-managed public boating/fishing access facility (boat ramp, canoe launch, fish...(2) Engaged in a prohibited activity or used the facility outside posted hours/conditions (3) ...(4) Without required OFBA Special Use Permit for events or non-standard uses
---
STATUTE: 320 CMR 2.00 /...
CHARGE: OFBA Facility — Unauthorized Commercial or Event Use
ELEMENTS: (1) Conducted a commercial enterprise, organized event, or group activity (2) At an OFBA-manag...(3) Without an OFBA Special Use Permit (4) Including fishing tournaments, guided outings, boat...
---
STATUTE: 320 CMR...
CHARGE: OFBA Facility — Violation of Fee/Permit Requirement
ELEMENTS: (1) Used an OFBA facility that requires a fee or permit (2) Without paying the required fee or...(3) Facilities authorized to collect user fees must charge equally to all state residents (4) ...
---
STATUTE: M.G.L. c. 131 §§ 1-92 / 321...(DFW Hunting/Fishing Regulations)
CHARGE: Division of Fisheries and Wildlife — Hunting/Fishing Season or Method Violation
ELEMENTS: (1) Took fish, birds, or mammals (2) Outside the open season established by DFW regulation (3)...(prohibited gear, prohibited weapon, illegal bait) (4) Or in excess of the bag/possession limit (5) Without required license, permit, or stamp (h...
---
STATUTE: 321 CMR 3.02 (DFW Hunting Safety Regulations)
CHARGE: Hunting Safety Violation — Alcohol/Drugs While Hunting
ELEMENTS: (1) Hunted or carried a firearm/bow (2) While under the influence of intoxicating liquor or co...(3) On any public or private land (4) Per M.G.L. c. 131 §62 — same standard as motor vehicle O...
---
STATUTE: M.G.L. c. 131 §10 / ...
CHARGE: Hunting or Trapping in Wildlife Sanctuary
ELEMENTS: (1) Hunted, trapped, or took wildlife (2) Within a designated DFW wildlife sanctuary (3) Poste...(4) Without specific director authorization
---
STATUTE: 320 CMR 2.04 (OFBA Public Access Facilities — Prohibitions)
CHARGE: 320 CMR 2.04 — Prohibited Activity at OFBA Public Access Facility
ELEMENTS: (1) Person was at an OFBA-managed public access facility (boat ramp, canoe launch, fishing pie...(2) Engaged in one or more prohibited acts without a special or general permit: camping or ove...(3) No valid OFBA Special Use Permit authorizing the activity
---
STATUTE: 320 CMR 2.03 (OFBA Special Use Permit Required)
CHARGE: 320 CMR 2.03 — Conducting Event/Commercial Activity at OFBA Facility Without Permit
ELEMENTS: (1) Organized, conducted, or participated in an event, commercial activity, or non-standard us...(2) Including tournaments, guided trips, media production, group events, or commercial rentals...(3) Without first obtaining an OFBA Special Use Permit from the Director
---
STATUTE: 321 CMR 2.00 (Miscellaneous Fisheries and Wildlife Regulations)
CHARGE: 321 CMR 2.08 — Prohibited Trap Possession/Use
ELEMENTS: (1) Used, set, placed, maintained, or possessed (2) A prohibited trap (leghold trap, body-grip...(3) In any woods, field, or waters of Massachusetts or anywhere fur-bearing mammals may be fou...(4) Outside health/safety exceptions authorized by Department of Public Health or municipal bo...
---
ST...(License Display Requirements)
CHARGE: 321 CMR 2.11 — Failure to Display/Carry License or Required Stamp While Hunting/Fishing/Trapping
ELEMENTS: (1) Was engaged in hunting, fishing, or trapping (2) Failed to possess on person a current val...(3) Or failed to carry required stamps: Massachusetts waterfowl stamp (for waterfowl hunting),...(exclusive archery season), primitive firearms stamp, or turkey/deer/bear tag (paper copy required for deer/turkey/bear) (4) Or refused to produce license upon demand of an authorized officer
---
STATUTE: 321 CMR 2.15 (Importation and Transportation of Wildlife)
CHARGE: 321 CMR 2.15 — Unlawful Importation/Liberation/Transportation of Fish, Amphibians, Reptiles, Birds, or Mammals
ELEMENTS: (1) Imported, liberated, or transported fish, amphibians, reptiles, birds, or mammals into or ...(2) Without the permit required under M.G.L. c.131 §19A or §26 (3) Or in violation of disease ...(4) Or liberated live non-native species without director approval
---
STATUTE: 321 CMR 2.16 (Wildlife Contest Prohibition)
CHARGE: 321 CMR 2.16 — Unlawful Wildlife Killing Contest
ELEMENTS: (1) Organized, conducted, participated in, or solicited participation in (2) A contest, tourna...(coyotes, foxes, bobcats, etc.) (3) Offering prizes or compensation for taking or killing (4) Without exemption for fishing de...
---
STATUTE: 321 CMR...(Wildlife Waste Prohibition)
CHARGE: 321 CMR 2.17 — Unlawful Waste of Game (Deer, Turkey, or Bear)
ELEMENTS: (1) Took or killed a deer, wild turkey, or black bear (2) Failed to make reasonable use of the...(3) Left the animal to waste without making reasonable efforts to retrieve and utilize the gam...
---
STAT...(Hunting Regulations)
CHARGE: 321 CMR 3.02 — Hunting Outside Open Season or In Violation of Bag/Method Limits
ELEMENTS: (1) Hunted a regulated game species (deer, turkey, bear, waterfowl, pheasant, quail, woodcock,...(2) Outside the open season established in 321 CMR 3.02 for that species and zone (3) Or in ex...(4) Or by a prohibited method (electronic calls for waterfowl, lead shot for waterfowl, illega...(5) Failure to tag deer/turkey/bear immediately upon taking
---
STATUTE: 321 CMR 3.02 (Hunting Safety and License Display)
CHARGE: 321 CMR 3.02 — Hunting Safety Violation (Alcohol, Loaded Firearm, Orange Clothing)
ELEMENTS: (1) Was engaged in hunting or carried a firearm while hunting AND (2) Was under the influence ...(3) Carried a loaded firearm in a motor vehicle, aircraft, or motorboat per c.131 §63; OR (4) ...(5) Hunted within 150 feet of a dwelling without consent, or across a public highway per c.131...
---
S...(Reptiles and Amphibians)
CHARGE: 321 CMR 3.05 — Unlawful Taking/Possession of Reptiles or Amphibians
ELEMENTS: (1) Took, possessed, transported, or sold a reptile or amphibian species (2) In violation of 3...(3) Including protected species (wood turtle, spotted turtle, box turtle, timber rattlesnake) ...(4) Or exceeded commercial or personal possession limits
---
STATUTE: 321 CMR 4.00 (Freshwater Fishing Regulations)
CHARGE: 321 CMR 4.01 — Freshwater Fishing Violation (Season, Size, Creel Limit, Method)
ELEMENTS: (1) Fished for or possessed freshwater fish in Massachusetts inland waters (2) Outside open se...(daily possession) limit per 321 CMR 4.01 Table 1 (3) Or used a prohibited method: snagging/snatching, spearing outside authorized seasons, gill...(toggles) improperly used (4) Or fished in a designated closed water, breeding area, or upstream of a posted dam without...
---
ST...(Coldwater Fish Resources Protection)
CHARGE: 321 CMR 5.00 — Violation of Coldwater Resource Protection Regulations
ELEMENTS: (1) Conducted activity in or adjacent to a coldwater fish resource (trout/salmon stream, Class...(2) In violation of stocking, access, or habitat protection measures adopted under 321 CMR 5.0...(3) Or fished a designated wild or heritage trout stream using prohibited bait or methods (art...
---
STATUTE: 321 CMR 7.00 (Wildlife Sanctuaries)
CHARGE: 321 CMR 7.01 — Unlawful Activity in a DFW Wildlife Sanctuary
ELEMENTS: (1) Entered upon or conducted hunting, trapping, or taking of wildlife (2) Within a designated...(3) Posted with notice of sanctuary designation under M.G.L. c.131 §9 (4) Without specific dir...
---
STATUTE: 321 CMR 10.00 (Massachusetts Endangered Species Act Regulations)
CHARGE: 321 CMR 10.00 — MESA Take of Listed Species / Alteration of Significant or Priority Habitat
ELEMENTS: (1) Took a species listed as endangered, threatened, or of special concern under MESA (see 321...(2) OR altered, filled, dredged, or otherwise modified a Significant Habitat designated under ...(3) Without a Conservation and Management Permit under 321 CMR 10.23 (4) Persons conducting ac...
---
STATUTE: 322 CMR 3.00 (Marine Finfish Regulations — 1971 Compilation and Gear Rules)
CHARGE: 322 CMR 3.00 — Unlawful Snagging/Snatching of Marine Fish / Gear Area Violations
ELEMENTS: (1) Took or attempted to take fish in Massachusetts coastal waters by snagging, snatching, or ...(2) Or used mobile gear (trawls, drags, dredges) in a restricted area under 322 CMR 3.02 or 32...(3) Or operated mobile gear outside the authorized hours (from ½ hour before sunrise to ½ hour...(4) Or used gear that created conflicts with lawfully set fixed gear
---
STATUTE: 322 CMR 6.00 (Lobster, Crab, and Shellfish Regulations)
CHARGE: 322 CMR 6.00 — Lobster/Shellfish Minimum Size / V-Notch / Egg-Bearing Violation
ELEMENTS: (1) Took, possessed, or sold lobster below minimum carapace length (3¼ inches for MA coastal w...(2) Or took, possessed, or sold a v-notched female lobster (3) Or possessed an egg-bearing (be...(4) Or took shellfish (clams, quahogs, oysters, scallops, mussels) below minimum size per 322 ...(5) The more restrictive of state or federal minimum sizes applies
---
STATUTE: 322 CMR 6.05 (Striped Bass Regulations)
CHARGE: 322 CMR 6.05 — Striped Bass Size/Bag Limit/Method Violation
ELEMENTS: (1) Took, possessed, sold, or offered for sale striped bass (2) Below the minimum length (curr...(3) Or exceeded the daily bag limit (4) Or used a prohibited method (gill nets, certain traps,...
---
STATUTE: 322 CMR 7.00 (Marine Fisheries Permit System)
CHARGE: 322 CMR 7.01 — Commercial Marine Fishing Without Permit / Permit Violation
ELEMENTS: (1) Conducted any marine fishery activity requiring a permit under M.G.L. c.130 or 322 CMR (2)...(3) Or falsified an application, altered/mutilated a permit, or transferred/loaned a permit to...(4) Or failed to produce permit on demand of authorized officer (may display on mobile device ...(5) Or harassed, threatened, or assaulted an enforcement officer
---
STATUTE: 322 CMR 8.00 (Coastal Fisheries Conservation and Management)
CHARGE: 322 CMR 8.00 — Coastal Fisheries Conservation Violation (Quotas, Closed Areas, Gear)
ELEMENTS: (1) Fished for or possessed coastal finfish or shellfish in Commonwealth waters (2) In violati...(3) Including violations of groundfish closure areas under 322 CMR 8.12, gear type restriction...
---
STATUTE: 322 CMR 9.00 (Atlantic Sea Herring Management)
CHARGE: 322 CMR 9.00 — Sea Herring Quota/Permit/At-Sea Transfer Violation
ELEMENTS: (1) Commercially fished for, retained, possessed, or landed Atlantic sea herring in Commonweal...(2) In violation of sub-area catch caps or trip limits (3) Or conducted an unauthorized at-sea...(4) Without a valid sea herring endorsement on commercial permit
---
STATUTE: 322 CMR 10.00 (Moderately Contaminated Shellfish Management)
CHARGE: 322 CMR 10.00 — Taking/Selling Shellfish from Contaminated Area Without Authorization
ELEMENTS: (1) Harvested, possessed, transported, or sold shellfish (2) From a designated contaminated or...(3) Without a valid Master or Subordinate Digger permit under 322 CMR 10.00 (4) Or failed to c...
---
STATUTE: 322 CMR 12...(Protected Species)
CHARGE: 322 CMR 12.00 — Take of State-Protected Marine Species
ELEMENTS: (1) Took, possessed, transported, or sold a marine species protected under 322 CMR 12.00 (2) I...(3) Without an applicable permit or exemption (4) Note: federal MMPA and ESA protections apply...
---
S...(Aquaculture Products and Marine Aquaculture)
CHARGE: 322 CMR 14.00/15.00 — Marine Aquaculture Without Permit / Labeling Violation
ELEMENTS: (1) Operated a marine aquaculture facility or sold aquaculture products in the Commonwealth (2...(3) Or mislabeled or misrepresented aquaculture products under 322 CMR 14.00 (4) Or violated c...
---
STATUTE: 323 CMR 2.00 (The Use of Vessels — Motorboat Registration and Operation)
CHARGE: 323 CMR 2.03 — Failure to Display Certificate of Number / Registration Decal on Vessel
ELEMENTS: (1) Owned or operated a motorboat on Commonwealth waters (2) Failed to display the MA certific...(3) Or failed to display the current year registration decal adjacent to the registration numb...(4) Or operated a vessel with a number other than the one assigned to it
---
STATUTE: 323 CMR 2.00 (Use of Vessels — Safety Equipment and Operation)
CHARGE: 323 CMR 2.00 — Vessel Safety Equipment Violation / Unsafe Operation
ELEMENTS: (1) Operated a vessel on Commonwealth waters (2) Without required safety equipment (PFDs, fire...(3) Or operated in an unsafe manner creating hazard to persons or property (4) Or exceeded pos...(slow-no-wake zone, 200-foot shore limit, mooring area)
---
STATUTE: 323 CMR 4.00 (Personal Watercraft — PWC Operation)
CHARGE: 323 CMR 4.00 — Personal Watercraft Operating Restrictions Violation
ELEMENTS: (1) Operated a personal watercraft (jet ski, WaveRunner, or similar PWC) on Commonwealth water...(2) Outside authorized hours (sunrise to sunset only) (3) Or by an operator under 16 years of ...(4) Or within 150 feet of a swimmer, moored vessel, or shore at above-headway speed (5) Or on ...(6) Or without a Coast Guard-approved PFD (7) Or operated a PWC on waters where such operation...
---
STATUTE: 323 CMR 6.00 (Whitewater Rafting)
CHARGE: 323 CMR 6.00 — Commercial Whitewater Rafting Without License/Permit
ELEMENTS: (1) Operated a commercial whitewater rafting business on Massachusetts rivers (2) Without a va...(3) Or operated in violation of safety equipment, guide certification, or passenger capacity r...`;

// ─── SIGNATURE PAD ────────────────────────────────────────────────────────────
function SignaturePad({ onSave, onClear }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };
  const start = (e) => { e.preventDefault(); drawing.current = true; lastPos.current = getPos(e, canvasRef.current); };
  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
    lastPos.current = pos;
  };
  const stop = () => { drawing.current = false; };
  const clear = () => { canvasRef.current.getContext("2d").clearRect(0,0,500,120); onClear && onClear(); };
  return (
    <div>
      <div style={{border:"2px dashed #cbd5e1",borderRadius:"8px",background:"#f8fafc",overflow:"hidden",marginBottom:"8px"}}>
        <canvas ref={canvasRef} width={500} height={120} style={{display:"block",width:"100%",height:"120px",cursor:"crosshair",touchAction:"none"}}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <button onClick={clear} style={{flex:1,padding:"8px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"white",cursor:"pointer",fontSize:"13px",color:"#64748b"}}>Clear</button>
        <button onClick={() => onSave(canvasRef.current.toDataURL())} style={{flex:2,padding:"8px",borderRadius:"8px",border:"none",background:"#1e40af",color:"white",cursor:"pointer",fontSize:"13px",fontWeight:"700"}}>Save Signature</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LexiCrimeReports() {
  const [mode, setMode] = useState(null); // null=home, 'quick', 'guided'
  const [reportType, setReportType] = useState(null);
  const [step, setStep] = useState(0);
  const [facts, setFacts] = useState({});
  const [quickText, setQuickText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // {charges, narrative, elements}
  const [editedNarrative, setEditedNarrative] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [badgeNum, setBadgeNum] = useState("");
  const [signature, setSignature] = useState(null);
  const [showSig, setShowSig] = useState(false);
  const [toast, setToast] = useState("");
  const chatEndRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const REPORT_TYPES = [
    { id:"incident", label:"Incident", icon:"📋" },
    { id:"arrest", label:"Arrest", icon:"⚖️" },
    { id:"supplemental", label:"Supplemental", icon:"📎" },
    { id:"crash", label:"Traffic/Crash", icon:"🚗" },
    { id:"boat", label:"Boat Accident/Incident", icon:"⛵" },
    { id:"ohv", label:"OHV/ATV Accident/Incident", icon:"🏍️" },
  ];

  const GUIDED_QUESTIONS = {
    incident: [
      { id:"date", label:"Date & Time of Incident", type:"datetime-local" },
      { id:"location", label:"Location (address, waterway, trail, GPS coords)", type:"text", ph:"e.g. 42 Fisherman's Wharf, Gloucester MA / GPS 42.6°N 70.7°W" },
      { id:"weather", label:"Weather & Conditions", type:"text", ph:"e.g. Clear, 68°F, calm seas, good visibility" },
      { id:"callType", label:"How call was received", type:"select", opts:["Officer Observation","911 Dispatch","Radio Call","Direct Complaint","NOAA Vessel Monitoring Alert","Patrol - Routine","Marine Patrol","Other"] },
      { id:"violations", label:"Suspected violations observed (describe what you saw)", type:"textarea", ph:"e.g. Observed vessel hauling lobster traps without displaying required license buoy colors..." },
      { id:"subjects", label:"Subject(s) — name, DOB, address, description", type:"textarea", ph:"S-1: John Smith, WM, DOB 1/1/1980, 123 Main St..." },
      { id:"vessel", label:"Vessel/Vehicle info (if applicable)", type:"textarea", ph:"MA registration #, hull ID, make/model, color..." },
      { id:"evidence", label:"Evidence observed/seized", type:"textarea", ph:"e.g. 47 undersized lobsters, 3 unlicensed traps, 2 buoys with no identifying markings..." },
      { id:"statements", label:"Statements made by subjects/witnesses", type:"textarea", ph:"S-1 stated..." },
      { id:"actions", label:"Actions taken", type:"textarea", ph:"e.g. Issued citation #, seized gear, notified NOAA OLE, released subject..." },
    ],
    arrest: [
      { id:"date", label:"Date & Time of Arrest", type:"datetime-local" },
      { id:"location", label:"Location of Arrest", type:"text", ph:"Address or waterway" },
      { id:"weather", label:"Weather & Conditions", type:"text", ph:"e.g. Clear, calm seas" },
      { id:"callType", label:"How call was received", type:"select", opts:["Officer Observation","911 Dispatch","Radio Call","Direct Complaint","Warrant","Patrol - Routine","Marine Patrol","Other"] },
      { id:"arrestee", label:"Arrestee — full name, DOB, address, ID", type:"textarea", ph:"Name, DOB, address, license/permit numbers..." },
      { id:"vessel", label:"Vessel/Vehicle info (if applicable)", type:"textarea", ph:"MA registration, hull ID, make/model..." },
      { id:"probableCause", label:"Probable cause — what did you observe?", type:"textarea", ph:"This officer observed..." },
      { id:"evidence", label:"Evidence seized", type:"textarea", ph:"Items seized, quantity, condition..." },
      { id:"miranda", label:"Miranda rights administered?", type:"select", opts:["Yes — suspect invoked right to remain silent","Yes — suspect waived and made statements","No — not in custody at time of questioning","N/A"] },
      { id:"statements", label:"Statements made by arrestee/witnesses", type:"textarea", ph:"Arrestee stated..." },
      { id:"booking", label:"Booking/disposition", type:"textarea", ph:"Transported to, bail set, charges filed..." },
    ],
    supplemental: [
      { id:"origCase", label:"Original case number / incident date", type:"text", ph:"Case #2024-0042 / Jan 15, 2024" },
      { id:"purpose", label:"Purpose of supplemental (what new info)", type:"textarea", ph:"e.g. Follow-up interview, additional evidence, lab results..." },
      { id:"date", label:"Date of supplemental activity", type:"datetime-local" },
      { id:"newInfo", label:"New information / findings", type:"textarea", ph:"On the above date this officer..." },
      { id:"actions", label:"Actions taken / follow-up needed", type:"textarea", ph:"e.g. Forwarded to DA, additional citations issued..." },
    ],
    crash: [
      { id:"date", label:"Date & Time of Crash", type:"datetime-local" },
      { id:"location", label:"Location of crash", type:"text", ph:"Road/waterway, mile marker, nearest intersection" },
      { id:"weather", label:"Weather, road/water conditions, visibility", type:"text", ph:"e.g. Rainy, wet pavement, limited visibility" },
      { id:"unit1", label:"Unit 1 — operator name, DOB, license, vehicle/vessel info", type:"textarea", ph:"Name, DOB, license #, vehicle year/make/model/color/plate or vessel registration..." },
      { id:"unit2", label:"Unit 2 (if applicable)", type:"textarea", ph:"Same info as Unit 1..." },
      { id:"injuries", label:"Injuries — persons, severity, transported to", type:"textarea", ph:"V-1 complained of neck pain, transported by EMS to MGH..." },
      { id:"damage", label:"Property damage", type:"textarea", ph:"Unit 1: front-end damage estimated $3,000. Guardrail damaged..." },
      { id:"sequence", label:"Sequence of events (what happened)", type:"textarea", ph:"Unit 1 was traveling northbound on Rte 1 when..." },
      { id:"contributing", label:"Contributing factors observed", type:"textarea", ph:"e.g. Speed, failure to yield, alcohol suspected, equipment failure..." },
      { id:"citations", label:"Citations/arrests made", type:"text", ph:"e.g. Citation issued to Unit 1 operator for c.90 §17 Negligent Operation" },
    ],
  };

  // ── AI: Quick Mode ────────────────────────────────────────────────────────
  const runQuickMode = async () => {
    if (!quickText.trim() || !reportType) return;
    setLoading(true); setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:2000,
          system:`You are an expert Massachusetts Environmental Police / law enforcement report writer and legal analyst. You know all applicable MEP, NOAA, DCR, and Massachusetts statutes.

LAW DATABASE (use these to identify applicable charges):
${LAW_DATABASE}

When given facts of an incident:
1. Identify ALL applicable charges with exact statute citations and which elements are met
2. Write a complete professional police report narrative (third person, past tense, formal style)
3. List specific evidence supporting each charge

You MUST respond with ONLY a raw JSON object. No markdown. No backticks. No explanation before or after. No code fences. Start your response with { and end with }.

Required format:
{"charges":[{"statute":"exact citation","charge":"charge name","elements_met":["element 1 met","element 2 met"],"penalty":"penalty range"}],"narrative":"full professional narrative here","evidence_notes":"evidence summary"}

If no charges apply, use an empty charges array. The narrative must be a complete professional police report narrative in third person past tense.`,
          messages:[{role:"user",content:`Report type: ${reportType.toUpperCase()}\n\nFacts provided by officer:\n${quickText}\n\nIdentify all applicable charges and write a complete professional narrative.`}]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text).join("") || "{}";
      
      let parsed = null;
      try {
        // Try extracting JSON from anywhere in the response
        const jsonMatch = text.match(/\{[\s\S]*"charges"[\s\S]*\}/);
        const raw = jsonMatch ? jsonMatch[0] : text.replace(/```json|```|json/gi,'').trim();
        parsed = JSON.parse(raw);
      } catch(e1) {
        try {
          // Fallback: find first { and last } and parse between them
          const first = text.indexOf('{');
          const last = text.lastIndexOf('}');
          if (first >= 0 && last > first) {
            parsed = JSON.parse(text.substring(first, last+1));
          }
        } catch(e2) {
          // Final fallback: build a basic result from the raw text
          parsed = {
            charges: [{statute:"See narrative", charge:"AI identified potential violations — see narrative for details", elements_met:["Review narrative for applicable elements"], penalty:"Per applicable statute"}],
            narrative: text.replace(/```json?|```/g,'').replace(/^[\s\S]*?(?=On |This officer|Upon )/,'').trim() || text,
            evidence_notes: "Review full AI response for charge details."
          };
        }
      }
      if (!parsed) parsed = {charges:[], narrative:text, evidence_notes:""};
      setAiResult(parsed);
      setEditedNarrative(parsed.narrative || "");
    } catch(e) { showToast("Connection error — check network and try again."); }
    setLoading(false);
  };

  // ── AI: Guided Mode ───────────────────────────────────────────────────────
  const runGuidedMode = async () => {
    if (!reportType) return;
    setLoading(true); setAiResult(null);
    const questions = GUIDED_QUESTIONS[reportType] || [];
    const factSummary = questions.map(q => `${q.label}: ${facts[q.id] || "Not provided"}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:2000,
          system:`You are an expert Massachusetts Environmental Police / law enforcement report writer and legal analyst. You know all applicable MEP, NOAA, DCR, and Massachusetts statutes.

LAW DATABASE (use these to identify applicable charges):
${LAW_DATABASE}

When given facts of an incident:
1. Identify ALL applicable charges with exact statute citations and which elements are met
2. Write a complete professional police report narrative (third person, past tense, formal style)
3. List specific evidence supporting each charge

You MUST respond with ONLY a raw JSON object. No markdown. No backticks. No explanation before or after. No code fences. Start your response with { and end with }.

Required format:
{"charges":[{"statute":"exact citation","charge":"charge name","elements_met":["element 1 met","element 2 met"],"penalty":"penalty range"}],"narrative":"full professional narrative here","evidence_notes":"evidence summary"}

If no charges apply, use an empty charges array. The narrative must be a complete professional police report narrative in third person past tense.`,
          messages:[{role:"user",content:`Report type: ${reportType.toUpperCase()}\n\nOfficer-provided facts:\n${factSummary}\n\nIdentify all applicable charges and write a complete professional narrative.`}]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text).join("") || "{}";
      
      let parsed = null;
      try {
        // Try extracting JSON from anywhere in the response
        const jsonMatch = text.match(/\{[\s\S]*"charges"[\s\S]*\}/);
        const raw = jsonMatch ? jsonMatch[0] : text.replace(/```json|```|json/gi,'').trim();
        parsed = JSON.parse(raw);
      } catch(e1) {
        try {
          // Fallback: find first { and last } and parse between them
          const first = text.indexOf('{');
          const last = text.lastIndexOf('}');
          if (first >= 0 && last > first) {
            parsed = JSON.parse(text.substring(first, last+1));
          }
        } catch(e2) {
          // Final fallback: build a basic result from the raw text
          parsed = {
            charges: [{statute:"See narrative", charge:"AI identified potential violations — see narrative for details", elements_met:["Review narrative for applicable elements"], penalty:"Per applicable statute"}],
            narrative: text.replace(/```json?|```/g,'').replace(/^[\s\S]*?(?=On |This officer|Upon )/,'').trim() || text,
            evidence_notes: "Review full AI response for charge details."
          };
        }
      }
      if (!parsed) parsed = {charges:[], narrative:text, evidence_notes:""};
      setAiResult(parsed);
      setEditedNarrative(parsed.narrative || "");
    } catch(e) { showToast("Connection error — check network and try again."); }
    setLoading(false);
  };

  // ── Print/Export ──────────────────────────────────────────────────────────
  const exportReport = () => {
    if (!aiResult) return;
    const win = window.open("","_blank");
    const sigHtml = signature ? `<img src="${signature}" style="max-width:220px;border-bottom:1px solid #000;display:block;margin-top:8px;"/>` : `<div style="border-bottom:1px solid #000;width:220px;height:50px;margin-top:8px;"></div>`;
    const chargesHtml = (aiResult.charges||[]).map(c => `
      <div style="margin-bottom:12px;padding:10px;background:#f9fafb;border-left:3px solid #1e40af;">
        <div style="font-weight:bold;font-size:13px;">${c.charge}</div>
        <div style="font-family:monospace;font-size:11px;color:#1e40af;margin:2px 0;">${c.statute}</div>
        <div style="font-size:11px;margin-top:4px;"><strong>Elements met:</strong> ${(c.elements_met||[]).join("; ")}</div>
        <div style="font-size:11px;color:#7f1d1d;margin-top:2px;"><strong>Penalty:</strong> ${c.penalty||"Per statute"}</div>
      </div>`).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Police Report</title>
    <style>body{font-family:Arial,sans-serif;font-size:12px;margin:40px;color:#000;}
    h1{font-size:18px;text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px;}
    h2{font-size:13px;background:#e5e7eb;padding:6px 10px;margin:16px 0 8px;}
    .narrative{line-height:1.8;white-space:pre-wrap;border:1px solid #ddd;padding:12px;background:#fafafa;}
    .sig{margin-top:24px;} .disclaimer{font-size:10px;color:#888;margin-top:24px;border-top:1px solid #ddd;padding-top:8px;}
    </style></head><body>
    <h1>NARRATIVE / SUMMARY OF FACTS FOR: ${(REPORT_TYPES.find(r=>r.id===reportType)?.label||reportType).toUpperCase()}</h1>
    <div style="display:flex;gap:40px;margin-bottom:12px;">
      <div><strong>Report Type:</strong> ${REPORT_TYPES.find(r=>r.id===reportType)?.label||reportType}</div>
      <div><strong>Date Generated:</strong> ${new Date().toLocaleString()}</div>
    </div>
    ${facts.date ? `<div style="margin-bottom:8px;"><strong>Incident Date/Time:</strong> ${new Date(facts.date).toLocaleString()}</div>` : ""}
    ${facts.location ? `<div style="margin-bottom:8px;"><strong>Location:</strong> ${facts.location}</div>` : ""}
    <h2>APPLICABLE CHARGES & ELEMENTS</h2>
    ${chargesHtml || "<p>No charges identified.</p>"}
    <h2>NARRATIVE</h2>
    <div class="narrative">${editedNarrative.replace(/\n/g,"<br/>")}</div>
    ${aiResult.evidence_notes ? `<h2>EVIDENCE NOTES</h2><p>${aiResult.evidence_notes}</p>` : ""}
    <h2>REPORTING OFFICER</h2>
    <div class="sig">
      <div><strong>Name:</strong> ${officerName||"_________________________"}</div>
      <div style="margin-top:6px;"><strong>Badge #:</strong> ${badgeNum||"_______"}</div>
      <div style="margin-top:6px;"><strong>Signature:</strong></div>
      ${sigHtml}
    </div>
    <div class="disclaimer">CONFIDENTIAL LAW ENFORCEMENT DOCUMENT — For official use only. Generated by LexiCrime Report Assistant. All charges and statutes should be verified with current official sources before use in legal proceedings.</div>
    </body></html>`);
    win.document.close(); win.print();
  };

  const sendEmail = (addr) => {
    if (!addr || !aiResult) return;
    const charges = (aiResult.charges||[]).map(c=>`${c.charge} (${c.statute})`).join("\n");
    const subj = encodeURIComponent(`Police Report - ${REPORT_TYPES.find(r=>r.id===reportType)?.label} - ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(`CHARGES IDENTIFIED:\n${charges}\n\nNARRATIVE:\n${editedNarrative}\n\nOfficer: ${officerName} Badge: ${badgeNum}\n\nNote: Open the app and use Print/Export PDF for the complete formatted report with signature.`);
    window.location.href = `mailto:${addr}?subject=${subj}&body=${body}`;
  };

  const questions = reportType ? (GUIDED_QUESTIONS[reportType] || []) : [];
  const currentQ = questions[step];
  const progress = questions.length ? Math.round((step/questions.length)*100) : 0;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:"#0f172a",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {toast && <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#1e293b",color:"white",padding:"10px 20px",borderRadius:"99px",fontSize:"13px",fontWeight:"600",zIndex:9999,boxShadow:"0 4px 12px rgba(0,0,0,0.4)"}}>{toast}</div>}

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",borderBottom:"1px solid #334155",flexShrink:0}}>
        <div style={{width:"36px",height:"36px",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        </div>
        <div>
          <div style={{color:"white",fontWeight:"800",fontSize:"17px"}}>LexiCrime</div>
          <div style={{color:"#94a3b8",fontSize:"10px"}}>Officer Report Assistant · MEP / NOAA / DCR / MA</div>
        </div>
        {(mode || reportType) && (
          <button onClick={()=>{setMode(null);setReportType(null);setStep(0);setFacts({});setQuickText("");setAiResult(null);setSignature(null);setShowSig(false);}}
            style={{marginLeft:"auto",background:"#334155",color:"#94a3b8",border:"none",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",cursor:"pointer"}}>← Home</button>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px",maxWidth:"700px",margin:"0 auto",width:"100%",boxSizing:"border-box"}}>

        {/* ── HOME ── */}
        {!reportType && !mode && (
          <div style={{paddingTop:"24px"}}>
            <div style={{textAlign:"center",marginBottom:"28px"}}>
              <div style={{fontSize:"36px",marginBottom:"8px"}}>📋</div>
              <h1 style={{color:"white",fontSize:"22px",fontWeight:"800",margin:"0 0 6px"}}>Officer Report Assistant</h1>
              <p style={{color:"#94a3b8",fontSize:"13px",margin:0}}>AI-powered report writing with automatic charge identification</p>
            </div>

            <div style={{marginBottom:"20px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Select Report Type</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                {REPORT_TYPES.map(rt => (
                  <button key={rt.id} onClick={()=>setReportType(rt.id)}
                    style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6";e.currentTarget.style.background="#1e3a8a20"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.background="#1e293b"}}>
                    <div style={{fontSize:"24px",marginBottom:"6px"}}>{rt.icon}</div>
                    <div style={{color:"white",fontWeight:"700",fontSize:"13px"}}>{rt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>Reporting Officer</div>
              <div style={{marginBottom:"6px",fontSize:"12px",color:"#94a3b8"}}>Enter once — carried through to all reports</div>
              <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
                <input value={officerName} onChange={e=>setOfficerName(e.target.value)} placeholder="Officer Name"
                  style={{flex:2,background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",padding:"10px",color:"white",fontSize:"13px"}}/>
                <input value={badgeNum} onChange={e=>setBadgeNum(e.target.value)} placeholder="Badge #"
                  style={{flex:1,background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",padding:"10px",color:"white",fontSize:"13px"}}/>
              </div>
            </div>
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>AI Knowledge Base</div>
              {[
                {label:"MA Environmental Police", sub:"c.130/131/131A/90B/270/272/90 + c.21A"},
                {label:"Federal NOAA Regulations", sub:"MSA, ESA, MMPA, Lacey Act, NMSA, 50 CFR 648"},
                {label:"US Fish & Wildlife Service Laws", sub:"MBTA, BGEPA, ESA (USFWS), Lacey Act, Fish & Wildlife Act 1956, Falconry/Raptor regs"},
                {label:"320 CMR — Dept. of Fish & Game / OFBA", sub:"Public access facilities, special use permits (320 CMR 2.00)"},
                {label:"321 CMR — Division of Fisheries & Wildlife", sub:"Hunting (3.00), Fishing (4.00), Trapping (2.08), Reptiles (3.05), Sanctuaries (7.00), MESA (10.00)"},
                {label:"322 CMR — Division of Marine Fisheries", sub:"Lobster/shellfish sizes (6.00), Striped bass (6.05), Permits (7.00), Coastal fisheries (8.00), Aquaculture (14-15.00)"},
                {label:"323 CMR — Division of Law Enforcement", sub:"Vessel registration/display (2.00), PWC operation (4.00), Whitewater rafting (6.00)"},
                {label:"DCR Laws & Regulations", sub:"302 CMR 12.00, c.132A"},
                {label:"MA General Statutes", sub:"OUI, A&B, trespass, weapons, environmental"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:i<3?"1px solid #334155":"none"}}>
                  <div style={{width:"8px",height:"8px",background:"#22c55e",borderRadius:"50%",flexShrink:0}}/>
                  <div>
                    <div style={{color:"white",fontSize:"12px",fontWeight:"600"}}>{item.label}</div>
                    <div style={{color:"#64748b",fontSize:"10px"}}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODE SELECT ── */}
        {reportType && !mode && (
          <div style={{paddingTop:"20px"}}>
            <div style={{color:"#94a3b8",fontSize:"12px",marginBottom:"4px"}}>Selected</div>
            <div style={{color:"white",fontSize:"18px",fontWeight:"800",marginBottom:"20px"}}>
              {REPORT_TYPES.find(r=>r.id===reportType)?.icon} {REPORT_TYPES.find(r=>r.id===reportType)?.label}
            </div>
            <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>How would you like to enter facts?</div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {[
                {id:"quick",icon:"⚡",title:"Quick Mode",sub:"Describe what happened in plain language — AI identifies charges and writes the full report"},
                {id:"guided",icon:"📝",title:"Guided Wizard",sub:"Answer structured questions step by step — best for complex incidents requiring full documentation"},
              ].map(m=>(
                <button key={m.id} onClick={()=>setMode(m.id)}
                  style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"18px",cursor:"pointer",textAlign:"left",display:"flex",gap:"14px",alignItems:"flex-start"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155"}}>
                  <div style={{fontSize:"28px"}}>{m.icon}</div>
                  <div>
                    <div style={{color:"white",fontWeight:"700",fontSize:"14px",marginBottom:"4px"}}>{m.title}</div>
                    <div style={{color:"#64748b",fontSize:"12px",lineHeight:"1.5"}}>{m.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── QUICK MODE ── */}
        {mode==="quick" && !aiResult && (
          <div style={{paddingTop:"16px"}}>
            <div style={{color:"white",fontSize:"16px",fontWeight:"800",marginBottom:"4px"}}>⚡ Quick Mode</div>
            <div style={{color:"#64748b",fontSize:"12px",marginBottom:"16px"}}>{REPORT_TYPES.find(r=>r.id===reportType)?.label} · Describe what happened</div>
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"16px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>Describe the incident in your own words</div>
              <textarea value={quickText} onChange={e=>setQuickText(e.target.value)} rows={10}
                placeholder={"e.g. On patrol on Cape Cod Bay I observed a vessel hauling lobster traps. I approached and the operator had no license displayed. Upon boarding I found 47 lobsters, 12 of which were undersized (under 3.25 inch carapace). The operator stated he had a permit but could not produce it. I also observed the buoys had no identifying color scheme or license number. I seized the undersized lobsters and gear..."}
                style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",padding:"12px",color:"white",fontSize:"13px",lineHeight:"1.6",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
            <button onClick={runQuickMode} disabled={loading||!quickText.trim()}
              style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:loading||!quickText.trim()?"#334155":"linear-gradient(135deg,#1e40af,#3b82f6)",color:loading||!quickText.trim()?"#64748b":"white",fontSize:"15px",fontWeight:"700",cursor:loading||!quickText.trim()?"not-allowed":"pointer"}}>
              {loading ? "⏳ Analyzing & Drafting Report..." : "🔍 Identify Charges & Generate Report"}
            </button>
          </div>
        )}

        {/* ── GUIDED WIZARD ── */}
        {mode==="guided" && !aiResult && (
          <div style={{paddingTop:"16px"}}>
            <div style={{color:"white",fontSize:"16px",fontWeight:"800",marginBottom:"4px"}}>📝 Guided Wizard</div>
            <div style={{color:"#64748b",fontSize:"12px",marginBottom:"12px"}}>{REPORT_TYPES.find(r=>r.id===reportType)?.label}</div>
            <div style={{background:"#334155",borderRadius:"99px",height:"4px",marginBottom:"12px",overflow:"hidden"}}>
              <div style={{background:"linear-gradient(90deg,#1e40af,#3b82f6)",height:"100%",width:progress+"%",transition:"width 0.3s",borderRadius:"99px"}}/>
            </div>
            <div style={{fontSize:"11px",color:"#64748b",marginBottom:"14px"}}>Question {step+1} of {questions.length}</div>
            {currentQ && (
              <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"16px",marginBottom:"12px"}}>
                <label style={{display:"block",fontWeight:"700",fontSize:"14px",color:"white",marginBottom:"10px"}}>{currentQ.label}</label>
                {currentQ.type==="select" ? (
                  <select value={facts[currentQ.id]||""} onChange={e=>setFacts(p=>({...p,[currentQ.id]:e.target.value}))}
                    style={{width:"100%",padding:"10px",background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",color:"white",fontSize:"14px",boxSizing:"border-box"}}>
                    <option value="">Select...</option>
                    {currentQ.opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                ) : currentQ.type==="textarea" ? (
                  <textarea value={facts[currentQ.id]||""} onChange={e=>setFacts(p=>({...p,[currentQ.id]:e.target.value}))}
                    placeholder={currentQ.ph} rows={4}
                    style={{width:"100%",padding:"10px",background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",color:"white",fontSize:"13px",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/>
                ) : (
                  <input type={currentQ.type} value={facts[currentQ.id]||""} onChange={e=>setFacts(p=>({...p,[currentQ.id]:e.target.value}))}
                    placeholder={currentQ.ph}
                    style={{width:"100%",padding:"10px",background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",color:"white",fontSize:"14px",boxSizing:"border-box"}}/>
                )}
              </div>
            )}
            <div style={{display:"flex",gap:"8px"}}>
              {step>0 && <button onClick={()=>setStep(p=>p-1)} style={{flex:1,padding:"12px",borderRadius:"10px",border:"1px solid #334155",background:"#1e293b",color:"#94a3b8",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>← Back</button>}
              {step<questions.length-1 ? (
                <button onClick={()=>setStep(p=>p+1)} style={{flex:2,padding:"12px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#1e40af,#3b82f6)",color:"white",cursor:"pointer",fontSize:"14px",fontWeight:"700"}}>Next →</button>
              ) : (
                <button onClick={runGuidedMode} disabled={loading}
                  style={{flex:2,padding:"12px",borderRadius:"10px",border:"none",background:loading?"#334155":"linear-gradient(135deg,#065f46,#059669)",color:loading?"#64748b":"white",cursor:loading?"not-allowed":"pointer",fontSize:"14px",fontWeight:"700"}}>
                  {loading ? "⏳ Generating Report..." : "✓ Generate Report"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── REPORT RESULT ── */}
        {aiResult && (
          <div style={{paddingTop:"16px"}}>
            <div style={{color:"white",fontSize:"16px",fontWeight:"800",marginBottom:"16px"}}>
              ✅ {REPORT_TYPES.find(r=>r.id===reportType)?.label} — Complete
            </div>

            {/* Charges */}
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>
                ⚖️ Applicable Charges ({(aiResult.charges||[]).length})
              </div>
              {(aiResult.charges||[]).map((c,i)=>(
                <div key={i} style={{marginBottom:"10px",paddingBottom:"10px",borderBottom:i<aiResult.charges.length-1?"1px solid #334155":"none"}}>
                  <div style={{fontWeight:"700",color:"white",fontSize:"13px"}}>{c.charge}</div>
                  <div style={{fontFamily:"monospace",color:"#60a5fa",fontSize:"11px",margin:"3px 0"}}>{c.statute}</div>
                  <div style={{fontSize:"11px",color:"#94a3b8",marginBottom:"4px"}}>
                    <strong style={{color:"#cbd5e1"}}>Elements met: </strong>
                    {(c.elements_met||[]).join(" · ")}
                  </div>
                  {c.penalty && <div style={{fontSize:"11px",color:"#fbbf24"}}><strong style={{color:"#fcd34d"}}>Penalty: </strong>{c.penalty}</div>}
                </div>
              ))}
            </div>

            {/* Narrative */}
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>📄 Report Narrative (editable)</div>
              <textarea value={editedNarrative} onChange={e=>setEditedNarrative(e.target.value)} rows={10}
                style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",padding:"12px",color:"white",fontSize:"13px",lineHeight:"1.7",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/>
              <div style={{fontSize:"11px",color:"#64748b",marginTop:"6px"}}>✏️ Review and edit above before exporting</div>
            </div>

            {/* Evidence Notes */}
            {aiResult.evidence_notes && (
              <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
                <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>🔍 Evidence & Charge Connections</div>
                <div style={{color:"#94a3b8",fontSize:"13px",lineHeight:"1.6"}}>{aiResult.evidence_notes}</div>
              </div>
            )}

            {/* Signature */}
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>✍️ Officer Signature</div>
              {/* Officer name/badge set on home screen */}
              <div style={{color:"#94a3b8",fontSize:"12px",marginBottom:"10px"}}>
                <strong style={{color:"white"}}>{officerName||"—"}</strong>{badgeNum ? " · Badge "+badgeNum : ""}
                {!officerName && <span style={{color:"#f59e0b"}}> ⚠ Return to home to set officer info</span>}
              </div>
              {signature ? (
                <div>
                  <img src={signature} alt="Signature" style={{maxWidth:"200px",display:"block",border:"1px solid #334155",borderRadius:"4px",marginBottom:"6px",background:"white"}}/>
                  <button onClick={()=>{setSignature(null);setShowSig(true);}} style={{fontSize:"12px",color:"#60a5fa",background:"none",border:"none",cursor:"pointer",padding:0}}>Re-sign</button>
                </div>
              ) : showSig ? (
                <SignaturePad onSave={d=>{setSignature(d);setShowSig(false);}} onClear={()=>setSignature(null)}/>
              ) : (
                <button onClick={()=>setShowSig(true)} style={{width:"100%",padding:"12px",borderRadius:"8px",border:"2px dashed #475569",background:"transparent",cursor:"pointer",fontSize:"13px",color:"#64748b"}}>
                  + Tap to Sign
                </button>
              )}
            </div>

            {/* Export */}
            <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>📤 Export Report</div>
              <button onClick={exportReport} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#1e40af,#3b82f6)",color:"white",cursor:"pointer",fontSize:"14px",fontWeight:"700",marginBottom:"8px"}}>
                🖨️ Print / Export PDF
              </button>
              <EmailExport onSend={sendEmail}/>
            </div>

            <button onClick={()=>{setAiResult(null);setMode(null);setReportType(null);setStep(0);setFacts({});setQuickText("");setSignature(null);setShowSig(false);}}
              style={{width:"100%",padding:"12px",borderRadius:"10px",border:"1px solid #334155",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"14px",marginBottom:"20px"}}>
              + Start New Report
            </button>
          </div>
        )}
      </div>
      {/* Footer */}
      <div style={{background:"#0f172a",borderTop:"1px solid #1e293b",padding:"10px 16px",textAlign:"center",flexShrink:0}}>
        <div style={{color:"#334155",fontSize:"10px",lineHeight:"1.6"}}>
          © 2026 LexiCrime Officer Report Assistant · All Rights Reserved · Proprietary &amp; Confidential
        </div>
        <div style={{color:"#1e293b",fontSize:"9px",marginTop:"2px"}}>
          For authorized MEP personnel only · All AI-generated content must be reviewed before official use
        </div>
      </div>
    </div>
  );
}

function EmailExport({ onSend }) {
  const [email, setEmail] = useState("");
  return (
    <div style={{display:"flex",gap:"8px"}}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="officer@pd.gov"
        style={{flex:1,background:"#0f172a",border:"1px solid #475569",borderRadius:"8px",padding:"10px",color:"white",fontSize:"13px"}}/>
      <button onClick={()=>onSend(email)} style={{padding:"10px 14px",borderRadius:"8px",border:"none",background:"#059669",color:"white",cursor:"pointer",fontSize:"13px",fontWeight:"700",whiteSpace:"nowrap"}}>
        📧 Email
      </button>
    </div>
  );
}
