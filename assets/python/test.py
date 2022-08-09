import json
import sys 

# json.loads -> json to dict
# json.dumps -> dict to json 
 
object_on_string_from_js = sys.argv[1]  
object_to_dict = json.loads(sys.argv[1]) 

print(json.dumps(object_to_dict.get('cookie')))

sys.stdout.flush()