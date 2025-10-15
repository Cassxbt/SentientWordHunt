// =====================================================
//  SENTIENT WORD HUNT - WORD LISTS & CONFIGURATION
//  AI-themed vocabulary for Sentient.xyz
// =====================================================

// ===== SENTIENT-RELATED WORDS =====
// These are the primary words players must find to win
// multiplier: 2 = 20 points, multiplier: 1 = 10 points

const SENTIENT_WORDS = [
    // ===== SHORTER WORDS (4-5 letters) - For easier levels =====
    // Standard 10 points
    { word: 'DATA', multiplier: 1, length: 4 },
    { word: 'CODE', multiplier: 1, length: 4 },
    { word: 'NODE', multiplier: 1, length: 4 },
    { word: 'HASH', multiplier: 1, length: 4 },
    { word: 'MINT', multiplier: 1, length: 4 },
    { word: 'BURN', multiplier: 1, length: 4 },
    { word: 'SWAP', multiplier: 1, length: 4 },
    { word: 'POOL', multiplier: 1, length: 4 },
    { word: 'SLOT', multiplier: 1, length: 4 },
    { word: 'SIGN', multiplier: 1, length: 4 },
    
    { word: 'CHAIN', multiplier: 1, length: 5 },
    { word: 'TOKEN', multiplier: 1, length: 5 },
    { word: 'LAYER', multiplier: 1, length: 5 },
    { word: 'LOGIC', multiplier: 1, length: 5 },
    { word: 'SMART', multiplier: 1, length: 5 },
    { word: 'PROOF', multiplier: 1, length: 5 },
    { word: 'SCALE', multiplier: 1, length: 5 },
    { word: 'EPOCH', multiplier: 1, length: 5 },
    { word: 'BLOCK', multiplier: 1, length: 5 },
    { word: 'SHARD', multiplier: 1, length: 5 },
    { word: 'CACHE', multiplier: 1, length: 5 },
    { word: 'QUERY', multiplier: 1, length: 5 },
    { word: 'INDEX', multiplier: 1, length: 5 },
    { word: 'STAKE', multiplier: 1, length: 5 },
    { word: 'ASYNC', multiplier: 1, length: 5 },
    { word: 'DOBBY', multiplier: 2, length: 5 },
    { word: 'LOYAL', multiplier: 1, length: 5 },
    { word: 'KAITO', multiplier: 2, length: 5 },
    { word: 'AWARD', multiplier: 1, length: 5 },
    { word: 'VISION', multiplier: 1, length: 6 },
    { word: 'SOURCE', multiplier: 1, length: 6 },
    
    // ===== MEDIUM WORDS (6-7 letters) - For intermediate levels =====
    // Premium 20 points
    { word: 'NEURAL', multiplier: 2, length: 6 },
    { word: 'AGENT', multiplier: 2, length: 5 },
    { word: 'MODEL', multiplier: 2, length: 5 },
    
    // Standard 10 points
    { word: 'SYSTEM', multiplier: 1, length: 6 },
    { word: 'CRYPTO', multiplier: 1, length: 6 },
    { word: 'ORACLE', multiplier: 1, length: 6 },
    { word: 'TENSOR', multiplier: 1, length: 6 },
    { word: 'MATRIX', multiplier: 1, length: 6 },
    { word: 'VECTOR', multiplier: 1, length: 6 },
    { word: 'BINARY', multiplier: 1, length: 6 },
    { word: 'KERNEL', multiplier: 1, length: 6 },
    { word: 'MEMORY', multiplier: 1, length: 6 },
    { word: 'THREAD', multiplier: 1, length: 6 },
    { word: 'MERKLE', multiplier: 1, length: 6 },
    { word: 'LEDGER', multiplier: 1, length: 6 },
    { word: 'WALLET', multiplier: 1, length: 6 },
    { word: 'PUBLIC', multiplier: 1, length: 6 },
    { word: 'SECURE', multiplier: 1, length: 6 },
    { word: 'VERIFY', multiplier: 1, length: 6 },
    { word: 'COMMIT', multiplier: 1, length: 6 },
    
    { word: 'NETWORK', multiplier: 2, length: 7 },
    { word: 'COMPUTE', multiplier: 2, length: 7 },
    { word: 'QUANTUM', multiplier: 1, length: 7 },
    { word: 'DIGITAL', multiplier: 1, length: 7 },
    { word: 'VIRTUAL', multiplier: 1, length: 7 },
    { word: 'MACHINE', multiplier: 1, length: 7 },
    { word: 'DEPLOY', multiplier: 1, length: 6 },
    { word: 'EXECUTE', multiplier: 1, length: 7 },
    { word: 'RUNTIME', multiplier: 1, length: 7 },
    { word: 'PROCESS', multiplier: 1, length: 7 },
    { word: 'BRIDGE', multiplier: 1, length: 6 },
    { word: 'PRIVATE', multiplier: 1, length: 7 },
    { word: 'ENCRYPT', multiplier: 1, length: 7 },
    { word: 'DECRYPT', multiplier: 1, length: 7 },
    { word: 'FOUNDER', multiplier: 2, length: 7 },
    { word: 'MISSION', multiplier: 2, length: 7 },
    { word: 'SEARCH', multiplier: 2, length: 6 },
    { word: 'PARALLEL', multiplier: 2, length: 8 },
    { word: 'RECURSIVE', multiplier: 2, length: 9 },
    
    // ===== LONGER WORDS (8+ letters) - For advanced levels =====
    // Premium 20 points
    { word: 'SENTIENT', multiplier: 2, length: 8 },
    { word: 'LEARNING', multiplier: 2, length: 8 },
    { word: 'TRAINING', multiplier: 2, length: 8 },
    { word: 'PLATFORM', multiplier: 2, length: 8 },
    { word: 'GRADIENT', multiplier: 2, length: 8 },
    { word: 'EMBEDDING', multiplier: 2, length: 9 },
    { word: 'ATTENTION', multiplier: 2, length: 9 },
    { word: 'PARAMETER', multiplier: 2, length: 9 },
    { word: 'REASONING', multiplier: 2, length: 9 },
    { word: 'COGNITIVE', multiplier: 2, length: 9 },
    { word: 'AUTONOMOUS', multiplier: 2, length: 10 },
    { word: 'FEDERATED', multiplier: 2, length: 9 },
    { word: 'BLOCKCHAIN', multiplier: 2, length: 10 },
    { word: 'INFERENCE', multiplier: 2, length: 9 },
    { word: 'ALGORITHM', multiplier: 2, length: 9 },
    { word: 'TRANSFORMER', multiplier: 2, length: 11 },
    { word: 'OPTIMIZATION', multiplier: 2, length: 12 },
    { word: 'DISTRIBUTED', multiplier: 2, length: 11 },
    { word: 'INTELLIGENCE', multiplier: 2, length: 12 },
    { word: 'DECENTRALIZE', multiplier: 2, length: 12 },
    { word: 'AUTHENTICITY', multiplier: 2, length: 12 },
    { word: 'FINGERPRINT', multiplier: 2, length: 11 },
    
    // Standard 10 points
    { word: 'PROTOCOL', multiplier: 1, length: 8 },
    { word: 'CONSENSUS', multiplier: 1, length: 9 },
    { word: 'VALIDATOR', multiplier: 1, length: 9 },
    { word: 'PIPELINE', multiplier: 1, length: 8 },
    { word: 'OWNERSHIP', multiplier: 1, length: 9 },
    { word: 'COMMUNITY', multiplier: 2, length: 9 },
    { word: 'FRAMEWORK', multiplier: 2, length: 9 },
    { word: 'BENCHMARK', multiplier: 1, length: 9 },
    { word: 'META', multiplier: 1, length: 4 },
    { word: 'ROMA', multiplier: 2, length: 4 },
    { word: 'DEEP', multiplier: 1, length: 4 }
];

// ===== BONUS DICTIONARY WORDS =====
// Additional common words for extra points (3 points each)

const BONUS_WORDS = [
    // 4-letter words
    'ABLE', 'BACK', 'BEAR', 'BEAT', 'BEEN', 'BEST', 'BLUE', 'BOAT', 'BOOK', 'BOTH',
    'CALL', 'CAME', 'CARE', 'CASE', 'CITY', 'COME', 'COOL', 'DARK', 'DEAL', 'DEEP',
    'DOOR', 'DOWN', 'DRAW', 'EACH', 'EASY', 'EVEN', 'FACE', 'FACT', 'FAIR', 'FALL',
    'FARM', 'FAST', 'FEEL', 'FEET', 'FINE', 'FIRE', 'FISH', 'FIVE', 'FLAT', 'FOOD',
    'FORM', 'FOUR', 'FREE', 'FROM', 'FULL', 'GAME', 'GAVE', 'GIRL', 'GIVE', 'GOLD',
    'GOOD', 'GRAY', 'GREW', 'GROW', 'HALF', 'HAND', 'HARD', 'HEAD', 'HEAR', 'HEAT',
    'HELD', 'HELP', 'HERE', 'HIGH', 'HILL', 'HOLD', 'HOME', 'HOPE', 'HOUR', 'IDEA',
    'INTO', 'IRON', 'JUST', 'KEEP', 'KIND', 'KING', 'KNEW', 'KNOW', 'LAND', 'LAST',
    'LATE', 'LEAD', 'LEFT', 'LESS', 'LIFE', 'LINE', 'LIST', 'LIVE', 'LONG', 'LOOK',
    'LOST', 'LOVE', 'MADE', 'MAIN', 'MAKE', 'MANY', 'MARK', 'MEAN', 'MEET', 'MILE',
    'MIND', 'MINE', 'MORE', 'MOST', 'MOVE', 'MUCH', 'MUST', 'NAME', 'NEAR', 'NEED',
    'NEXT', 'NINE', 'NONE', 'NOTE', 'ONCE', 'ONLY', 'OPEN', 'OVER', 'PAGE', 'PAIR',
    'PART', 'PASS', 'PAST', 'PATH', 'PLAN', 'PLAY', 'PLUS', 'POOR', 'PORT', 'PULL',
    'PURE', 'PUSH', 'RACE', 'RAIN', 'RANG', 'RATE', 'READ', 'REAL', 'REST', 'RICH',
    'RIDE', 'RING', 'RISE', 'ROAD', 'ROCK', 'ROLE', 'ROLL', 'ROOM', 'ROOT', 'ROSE',
    'RULE', 'SAFE', 'SAID', 'SAME', 'SAVE', 'SEAT', 'SEED', 'SEEM', 'SELF', 'SELL',
    
    // 5-letter words
    'ABOUT', 'ABOVE', 'AFTER', 'AGAIN', 'ALONG', 'AMONG', 'ANGLE', 'APPLE', 'ARMED',
    'ARRAY', 'BASIC', 'BEGIN', 'BEING', 'BLACK', 'BLOOD', 'BOARD', 'BRAIN', 'BREAD',
    'BREAK', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'CARRY',
    'CATCH', 'CAUSE', 'CHECK', 'CHIEF', 'CHILD', 'CHOSE', 'CLASS', 'CLEAN', 'CLEAR',
    'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COAST', 'COLOR', 'COULD', 'COUNT', 'COURT',
    'COVER', 'CRAFT', 'CROSS', 'CROWD', 'DANCE', 'DEATH', 'DEPTH', 'DOING', 'DOUBT',
    'DOZEN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'EARLY', 'EARTH',
    'EIGHT', 'ENEMY', 'ENTER', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST',
    'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL',
    'FIRST', 'FIXED', 'FLOOR', 'FORCE', 'FORTH', 'FORTY', 'FOUND', 'FRAME', 'FRANK',
    'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'GIVEN', 'GLASS', 'GOING', 'GRACE', 'GRADE',
    'GRAND', 'GRANT', 'GRASS', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD',
    'GUESS', 'GUIDE', 'HAPPY', 'HEARD', 'HEART', 'HEAVY', 'HORSE', 'HOTEL', 'HOUSE',
    'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JOINT', 'JUDGE',
    'KNOWN', 'LARGE', 'LATER', 'LAUGH', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL',
    
    // 6-letter words
    'ACCEPT', 'ACCESS', 'ACROSS', 'ACTION', 'ACTIVE', 'ACTUAL', 'ADVICE', 'AFFORD',
    'AFRAID', 'AGENCY', 'AGREED', 'ALLOW', 'ALMOST', 'AMOUNT', 'ANIMAL', 'ANNUAL',
    'ANSWER', 'ANYONE', 'APPEAR', 'AROUND', 'ARRIVE', 'ARTIST', 'ASPECT', 'ASSIGN',
    'ASSUME', 'ATTACK', 'AUGUST', 'AUTHOR', 'AVENUE', 'BACKED', 'BALANCE', 'BANKER',
    'BATTLE', 'BEAUTY', 'BECOME', 'BEFORE', 'BEHALF', 'BEHIND', 'BELIEF', 'BELONG',
    'BENEFIT', 'BETTER', 'BEYOND', 'BORDER', 'BOTTLE', 'BOTTOM', 'BOUGHT', 'BRANCH',
    'BRIDGE', 'BRIGHT', 'BROKEN', 'BUDGET', 'BURDEN', 'BUREAU', 'BUTTON', 'CAMERA',
    'CANCER', 'CARBON', 'CAREER', 'CASTLE', 'CASUAL', 'CAUGHT', 'CENTER', 'CENTRE',
    'CHANCE', 'CHANGE', 'CHARGE', 'CHOICE', 'CHOOSE', 'CHOSEN', 'CHURCH', 'CIRCLE',
    'CLIENT', 'CLOSED', 'CLOSER', 'COFFEE', 'COLUMN', 'COMBAT', 'COMING', 'COMMON',
    'COMPARE', 'COMPLY', 'COPPER', 'CORNER', 'COST', 'COTTON', 'COUNTY', 'COUPLE',
    'COURSE', 'COVERS', 'CREATE', 'CREDIT', 'CRISIS', 'CRITICAL', 'CUSTOM', 'DAMAGE',
    'DANGER', 'DEALER', 'DEBATE', 'DECADE', 'DECIDE', 'DEFEAT', 'DEFEND', 'DEFINE',
    'DEGREE', 'DEMAND', 'DEPEND', 'DEPUTY', 'DESERT', 'DESIGN', 'DESIRE', 'DETAIL',
    'DEVICE', 'DIFFER', 'DINNER', 'DIRECT', 'DIVIDE', 'DOCTOR', 'DOLLAR', 'DOMAIN',
    
    // 7-letter words
    'ABILITY', 'ABSENCE', 'ACADEMY', 'ACCOUNT', 'ACHIEVE', 'ACQUIRE', 'ADDRESS',
    'ADVANCE', 'ADVERSE', 'ADVISED', 'ADVISER', 'AGAINST', 'AIRCRAFT', 'ALREADY',
    'ANCIENT', 'ANOTHER', 'ANXIOUS', 'ANYBODY', 'APPLIED', 'APPROVE', 'ARRANGE',
    'ARRIVAL', 'ARTICLE', 'ARTIST', 'ASSAULT', 'ASSUMED', 'ASSURED', 'ATTEMPT',
    'ATTRACT', 'AVERAGE', 'BACKING', 'BALANCE', 'BANKING', 'BARRIER', 'BATTERY',
    'BEARING', 'BEATING', 'BECAUSE', 'BEDROOM', 'BENEFIT', 'BENEATH', 'BESIDES',
    'BETWEEN', 'BICYCLE', 'BINDING', 'BROTHER', 'BROUGHT', 'BURNING', 'CABINET',
    'CALIBER', 'CAPABLE', 'CAPITAL', 'CAPTAIN', 'CAPTURE', 'CAREFUL', 'CARRIER',
    'CENTURY', 'CERTAIN', 'CHAMBER', 'CHANNEL', 'CHAPTER', 'CHARITY', 'CHARTER',
    'CHECKED', 'CHICKEN', 'CIRCUIT', 'CLASSIC', 'CLIMATE', 'CLOSING', 'CLOTHES',
    'COLLECT', 'COLLEGE', 'COMBINE', 'COMFORT', 'COMMAND', 'COMMENT', 'COMMERCE',
    'COMPACT', 'COMPANY', 'COMPARE', 'COMPETE', 'COMPLEX', 'CONCEPT', 'CONCERN',
    'CONDUCT', 'CONFIRM', 'CONFLICT', 'CONNECT', 'CONSENT', 'CONSIST', 'CONSTANT',
    'CONSUME', 'CONTACT', 'CONTAIN', 'CONTENT', 'CONTEST', 'CONTEXT', 'CONTINUE',
    'CONTRACT', 'CONTROL', 'CONVERT', 'CORRECT', 'COUNCIL', 'COUNSEL', 'COUNTER',
    'COUNTRY', 'COURAGE', 'COVERED', 'CREATED', 'CRYSTAL', 'CULTURE', 'CURRENT',
    'CUTTING', 'DEALING', 'DECLINE', 'DEFAULT', 'DEFENSE', 'DELIVER', 'DENSITY',
    'DESTROY', 'DEVELOP', 'DEVOTED', 'DIAMOND', 'DIGITAL', 'DISCUSS', 'DISEASE',
    'DISPLAY', 'DISPUTE', 'DISTANT', 'DIVERSE', 'DRAWING', 'DRIVING', 'DYNAMIC'
];

// ===== GRID CONFIGURATION =====
const GRID_CONFIG = {
    size: 15,                   // 15x15 grid
    minSentientWords: 8,        // Minimum Sentient words per game
    maxSentientWords: 12,       // Maximum Sentient words per game
    minBonusWords: 15,          // Minimum bonus words per game
    maxBonusWords: 25           // Maximum bonus words per game
};

// ===== SCORING CONFIGURATION =====
const SCORING = {
    sentientBase: 10,           // Base points for Sentient words (×1 multiplier)
    bonusWord: 3                // Points for bonus dictionary words
};

// Note: Final points = sentientBase × multiplier
// Examples:
// - Sentient word with multiplier 1: 10 × 1 = 10 points
// - Sentient word with multiplier 2: 10 × 2 = 20 points
// - Bonus word: always 3 points

// ===== LEVEL SYSTEM CONFIGURATION =====
const LEVEL_CONFIG = [
    // Level 1 - Tutorial (Easy) - Smaller grid, more time, SHORT WORDS ONLY
    {
        level: 1,
        name: "Beginner",
        timeLimit: 240,        // 4 minutes (more time for easier level)
        targetScore: 50,       // Must score at least 50 points
        minWords: 5,           // Must find at least 5 Sentient words
        gridSize: 10,          // Smaller grid for beginners
        sentientWords: { min: 5, max: 7 },
        bonusWords: { min: 8, max: 12 },
        maxWordLength: 5,      // Only use 4-5 letter words
        hintsAllowed: 8        // Generous hints for learning
    },
    // Level 2 - Getting Started (SHORT to MEDIUM words)
    {
        level: 2,
        name: "Novice",
        timeLimit: 210,        // 3.5 minutes
        targetScore: 80,
        minWords: 6,
        gridSize: 11,
        sentientWords: { min: 6, max: 8 },
        bonusWords: { min: 10, max: 15 },
        maxWordLength: 6,      // 4-6 letter words
        hintsAllowed: 7        // Still learning
    },
    // Level 3 - Building Skills (MEDIUM words)
    {
        level: 3,
        name: "Apprentice",
        timeLimit: 180,        // 3 minutes
        targetScore: 100,
        minWords: 7,
        gridSize: 12,
        sentientWords: { min: 7, max: 9 },
        bonusWords: { min: 12, max: 18 },
        maxWordLength: 7,      // 4-7 letter words
        hintsAllowed: 6        // Building confidence
    },
    // Level 4 - Intermediate (MEDIUM to LONG words)
    {
        level: 4,
        name: "Skilled",
        timeLimit: 150,        // 2.5 minutes
        targetScore: 130,
        minWords: 8,
        gridSize: 13,
        sentientWords: { min: 8, max: 10 },
        bonusWords: { min: 14, max: 20 },
        maxWordLength: 8,      // 4-8 letter words
        hintsAllowed: 6        // Good support
    },
    // Level 5 - Advanced (LONGER words)
    {
        level: 5,
        name: "Advanced",
        timeLimit: 135,        // 2.25 minutes
        targetScore: 150,
        minWords: 9,
        gridSize: 14,
        sentientWords: { min: 9, max: 11 },
        bonusWords: { min: 16, max: 22 },
        maxWordLength: 9,      // 4-9 letter words
        hintsAllowed: 5        // Balanced help
    },
    // Level 6 - Expert (LONG words)
    {
        level: 6,
        name: "Expert",
        timeLimit: 120,        // 2 minutes
        targetScore: 180,
        minWords: 10,
        gridSize: 15,
        sentientWords: { min: 10, max: 12 },
        bonusWords: { min: 18, max: 24 },
        maxWordLength: 10,     // 4-10 letter words
        hintsAllowed: 5        // Still fair
    },
    // Level 7 - Master (VERY LONG words)
    {
        level: 7,
        name: "Master",
        timeLimit: 105,        // 1.75 minutes
        targetScore: 200,
        minWords: 11,
        gridSize: 16,          // Bigger grid
        sentientWords: { min: 11, max: 13 },
        bonusWords: { min: 20, max: 26 },
        maxWordLength: 11,     // 4-11 letter words
        hintsAllowed: 4        // Challenging but doable
    },
    // Level 8 - Legendary (ALL word lengths)
    {
        level: 8,
        name: "Legendary",
        timeLimit: 90,         // 1.5 minutes (challenging but fair)
        targetScore: 250,
        minWords: 12,
        gridSize: 17,          // Largest grid
        sentientWords: { min: 12, max: 15 },
        bonusWords: { min: 22, max: 28 },
        maxWordLength: 999,    // All words allowed
        hintsAllowed: 3        // Hard but passable
    }
];
