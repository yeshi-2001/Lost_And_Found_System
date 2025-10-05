from flask import Blueprint, jsonify

form_options_bp = Blueprint('form_options', __name__)

@form_options_bp.route('/form-options', methods=['GET'])
def get_form_options():
    """Get form options for dropdowns"""
    
    form_options = {
        "categories": [
            "Electronics",
            "Clothing & Accessories",
            "Books & Stationery",
            "Sports & Recreation",
            "Personal Items",
            "Bags & Luggage",
            "Jewelry & Watches",
            "Keys & Cards",
            "Other"
        ],
        "colors": {
            "found_items": [
                "Black",
                "White",
                "Gray",
                "Silver",
                "Blue",
                "Red",
                "Green",
                "Yellow",
                "Orange",
                "Purple",
                "Pink",
                "Brown",
                "Gold",
                "Multi-colored",
                "Other"
            ],
            "lost_items": [
                "Black",
                "White",
                "Gray",
                "Silver",
                "Blue",
                "Red",
                "Green",
                "Yellow",
                "Orange",
                "Purple",
                "Pink",
                "Brown",
                "Gold",
                "Multi-colored",
                "Other"
            ]
        },
        "locations": {
            "found_items": [
                "Library",
                "Cafeteria",
                "Classroom",
                "Laboratory",
                "Gymnasium",
                "Parking Lot",
                "Student Center",
                "Dormitory",
                "Auditorium",
                "Computer Lab",
                "Study Hall",
                "Restroom",
                "Hallway",
                "Office",
                "Other"
            ],
            "lost_items": [
                "Library",
                "Cafeteria",
                "Classroom",
                "Laboratory",
                "Gymnasium",
                "Parking Lot",
                "Student Center",
                "Dormitory",
                "Auditorium",
                "Computer Lab",
                "Study Hall",
                "Restroom",
                "Hallway",
                "Office",
                "Other"
            ]
        }
    }
    
    return jsonify(form_options), 200