import json
import re

def parse_interactions(text):
    change = [
        "CONTRE-INDICATION",
        "CI - ASDEC - APEC",
        "ASDEC - APEC",
        "ASDEC - PE",
        "CI - PE",
        "CI - ASDEC",
        "CI - APEC"
    ]
    for ci in change:
        text=text.replace(ci,ci.lower())

    # Split the text by the name of the substances, which are all uppercase
    substance_blocks = re.split(r'\n([A-ZÀ-ÿ][A-ZÀ-ÿ0-9 \-\'(),.;/]*[A-ZÀ-ÿ\-\'()]+)\n', text)[1:]
    
    interactions = {}
    for i in range(0, len(substance_blocks), 2):
        substance = substance_blocks[i].strip()
        details = substance_blocks[i + 1]
        for ci in change:
            details=details.replace(ci.lower(),ci)

        
        # Find all interactions for the current substance
        interaction_details = re.findall(
            r'\+\s*([A-ZÀ-ÿ][A-ZÀ-ÿ0-9\s\-\'(),.;/]+)'
            r'(Association DECONSEILLEE|Précaution d\'emploi|A prendre en compte|CONTRE-INDICATION|CI - ASDEC - APEC|ASDEC - APEC|ASDEC - PE|CI - PE|CI - ASDEC|CI - APEC)'
            r'([\s\S]+?)(?=\n\+|$)', 
            details
        )
        
        interactions_list = []
        for interaction in interaction_details:
            interacting_substance, association, detail = interaction
            interactions_list.append({
                "interacting_substance": interacting_substance.strip(),
                "association": association.strip(),
                "details": ' '.join(detail.split()).strip()  # Normalize whitespace
            })
        
        interactions[substance] = interactions_list

    return interactions

def save_interactions_to_json(interactions, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(interactions, f, ensure_ascii=False, indent=4)

with open('data/interaction.txt', 'r', encoding='utf-8') as f:
    text = f.read()
    
# Parse the interactions from the text
interactions = parse_interactions(text)

# Define the path where the JSON file will be saved
file_path = 'out/interaction.json'

# Save the interactions to a JSON file
save_interactions_to_json(interactions, file_path)

