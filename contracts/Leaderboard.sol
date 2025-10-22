// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CoinFlipLeaderboard {
    struct Score {
        string playerName;
        uint256 score;
        uint256 timestamp;
    }
    
    Score[] public leaderboard;
    
    event ScoreSaved(address player, string name, uint256 score);
    
    function saveScore(string memory playerName, uint256 score) public {
        leaderboard.push(Score({
            playerName: playerName,
            score: score,
            timestamp: block.timestamp
        }));
        
        emit ScoreSaved(msg.sender, playerName, score);
    }
    
    function getLeaderboard() public view returns (Score[] memory) {
        return leaderboard;
    }
    
    function getTopScores(uint256 limit) public view returns (Score[] memory) {
        uint256 length = leaderboard.length;
        if (length == 0) return new Score[](0);
        
        Score[] memory sorted = new Score[](length);
        for (uint256 i = 0; i < length; i++) {
            sorted[i] = leaderboard[i];
        }
        
        // Simple bubble sort
        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (sorted[i].score < sorted[j].score) {
                    Score memory temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }
        
        uint256 resultLength = length < limit ? length : limit;
        Score[] memory result = new Score[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = sorted[i];
        }
        
        return result;
    }
}