<?php

$post = file_get_contents("php://input");

/*echo "<pre>";
print_r($post);
die;*/

$post = json_decode($post, true);

#$ key here

$prompt = '{
    "adjusted_calories": "'.$post['calories'].'",
    "meal_type": "'.$post['meal_type'].'"
}

1. create total '.$post['meals'].' meals to cover my adjusted calories for single day
2. name for each meal must be like Meal 1, Meal 2 etc
3. each meal must have dish name as well
4. show total calories for each main meal
5. show protein, carbs and fat info for each mean as well
6. give me cooking method and steps for each meal
7. calories for all meals and snaks combine should be equal to adjusted_calories
8. show ingredients under each meal after calories<br>
9. always create json response
10. cooking steps must be an abject with key and value
11. ingredients must be an abject with key and value
12. user "meals" for meals object, "name" for meal name, "dish_name" for dish name, "calories" for calories, "cooking_method" for cooking method, "cooking_steps" for cooking steps, ingredients" for ingredients, "protein" for protein, "fat" for fat, "carbs" for carbs';

function call_openai_api($api_key, $prompt) {
	
	try{
		// Initialize cURL
		$openai_api_url_3 = 'https://api.openai.com/v1/chat/completions';
		
		$ch = curl_init($openai_api_url_3);
		$messages = array(
			array(
				'role' => 'user',
				'content' => $prompt
			)
		);
		$data = json_encode([
			"model"=> "gpt-3.5-turbo", //"gpt-4-1106-preview",
			'messages' => $messages,
			'max_tokens' => 1500,
			'temperature' => 0.7,
			'top_p' => 1,
			'frequency_penalty' => 0,
			'presence_penalty' => 0
		]);

		// Set HTTP headers
		curl_setopt($ch, CURLOPT_HTTPHEADER, [
			'Content-Type: application/json',
			'Authorization: Bearer ' . $api_key
		]);

		// Set cURL options
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

		// Execute the request
		$response = curl_exec($ch);
		curl_close($ch);

		// Handle the response
		if (!$response) {
			return 'Error: ' . curl_error($ch);
		}

		$decodedResponse = json_decode($response, true);
		/*echo "<pre>test 1: ";
		print_r($decodedResponse);*/
		return $decodedResponse['choices'][0]['message']['content'];
		
	} catch(Exception $e){
		/*echo "<pre>test 2: ";
		echo "data: Error: " . $e->getMessage() . "\n\n";
		die;*/
	}
    // Return the response
   // return json_decode($response, true)['choices'][0]['text'];
}

function call_openai_api4($api_key, $prompt) {
    // Initialize cURL
	$openai_api_url_4 = 'https://api.openai.com/v1/engines/gpt-4-1106-preview/completions';
	
    $ch = curl_init($openai_api_url_4);
	
    // Prepare the data for the API request
    $data = json_encode([
        'prompt' => $prompt,
        'max_tokens' => 500, // You can adjust this value based on your needs
        'temperature' => 0.7, // Adjust for more creative responses
        'top_p' => 1,
        'frequency_penalty' => 0,
        'presence_penalty' => 0
    ]);
	
    // Set HTTP headers
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key
    ]);
	
    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	
    // Execute the request
    $response = curl_exec($ch);
    curl_close($ch);
	
    // Handle the response
    if (!$response) {
        return 'Error: ' . curl_error($ch);
    }
	
    $decodedResponse = json_decode($response, true);
    print_r($decodedResponse);
    return $decodedResponse['choices'][0]['text'];
    // Return the response
   // return json_decode($response, true)['choices'][0]['text'];
}

$response = call_openai_api($api_key, $prompt);
//$response = json_decode($response, true);

echo $response;
die;

?>