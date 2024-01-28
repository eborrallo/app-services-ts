Feature: App endpoints storage

  Scenario: I want to upload a file to the server
    Given I upload a file "example.png" :
    """
    {
      "content-type": "image/png",
      "x-document-name": "cool",
      "x-meta-test": "hello-world",
      "x-source": "web",
      "x-bucket": "mybucket",
      "X-Correlation-ID": 123
    }
    """
    Then the response status code should be 201
    Then I fetch the document
    Then the response status code should be 200
    Then the uploaded file should be the same as the downloaded file



