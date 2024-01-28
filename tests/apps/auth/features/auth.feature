Feature: App endpoints auth


  Scenario: Store message on the database
    Given  I send a GET request to "/auth/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/message"
    Then the response status code should be 200
    And user "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" should exist

  Scenario: Sign message and login
    Given  existing user
    """
    [
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "message": "\nunknown wants you to sign in with your Ethereum account:\n0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\n\nSign in with ethereum to lens\n\nURI: unknown\nVersion: 1\nNetwork: goerli\nNonce: 00c6d1ac889f5ce6\nIssued At: 2023-07-31T13:26:56.962Z"
      }
    ]
    """
    And I send a POST request to "/auth/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/validate" with body:
    """
    {
      "signature":"0xfb2e55fa5e277bf60ca7d7374a8c836001bf1d5f3c334af117101e64bd30a9672a373a240e8ff65adc685676195fdbe035d28904504b267f040613de0f2c415e1b"
    }
    """
    Then the response status code should be 200
    And the response content should be:
    """
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhmMzlGZDZlNTFhYWQ4OEY2RjRjZTZhQjg4MjcyNzljZmZGYjkyMjY2IiwiaWF0IjoxNjkwODEzMjA1LCJleHAiOjE2OTA4OTk2MDV9.n9z9cEeNoIUR6i1-bq7exb_yI_9oeLMLsznU1IJAD_8"
    }
    """
