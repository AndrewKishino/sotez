**[Sotez Documentation](../README.md)**

[Globals](../README.md) › ["constants"](_constants_.md)

# External module: "constants"

## Index

### Variables

* [entrypointMappingReverse](_constants_.md#const-entrypointmappingreverse)
* [opMappingReverse](_constants_.md#const-opmappingreverse)

### Object literals

* [entrypointMapping](_constants_.md#const-entrypointmapping)
* [forgeMappings](_constants_.md#const-forgemappings)
* [forgeOpTags](_constants_.md#const-forgeoptags)
* [opMapping](_constants_.md#const-opmapping)
* [prefix](_constants_.md#const-prefix)
* [primMapping](_constants_.md#const-primmapping)
* [primMappingReverse](_constants_.md#const-primmappingreverse)
* [protocols](_constants_.md#const-protocols)
* [watermark](_constants_.md#const-watermark)

## Variables

### `Const` entrypointMappingReverse

• **entrypointMappingReverse**: *object* =  (() => {
  const result: { [key: string]: string } = {};
  Object.keys(entrypointMapping).forEach((key: string) => {
    result[entrypointMapping[key]] = key;
  });
  return result;
})()

*Defined in [constants.ts:251](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L251)*

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Const` opMappingReverse

• **opMappingReverse**: *object* =  (() => {
  const result: { [key: string]: string } = {};
  Object.keys(opMapping).forEach((key: string) => {
    result[opMapping[key]] = key;
  });
  return result;
})()

*Defined in [constants.ts:170](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L170)*

#### Type declaration:

* \[ **key**: *string*\]: string

## Object literals

### `Const` entrypointMapping

### ▪ **entrypointMapping**: *object*

*Defined in [constants.ts:242](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L242)*

###  00

• **00**: *string* = "default"

*Defined in [constants.ts:243](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L243)*

###  01

• **01**: *string* = "root"

*Defined in [constants.ts:244](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L244)*

###  02

• **02**: *string* = "do"

*Defined in [constants.ts:245](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L245)*

###  03

• **03**: *string* = "set_delegate"

*Defined in [constants.ts:246](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L246)*

###  04

• **04**: *string* = "remove_delegate"

*Defined in [constants.ts:247](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L247)*

___

### `Const` forgeMappings

### ▪ **forgeMappings**: *object*

*Defined in [constants.ts:259](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L259)*

###  entrypointMapping

• **entrypointMapping**: *object*

*Defined in [constants.ts:265](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L265)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  entrypointMappingReverse

• **entrypointMappingReverse**: *object*

*Defined in [constants.ts:266](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L266)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  forgeOpTags

• **forgeOpTags**: *object*

*Defined in [constants.ts:264](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L264)*

#### Type declaration:

* \[ **key**: *string*\]: object

* \[ **key**: *string*\]: number

###  opMapping

• **opMapping**: *object*

*Defined in [constants.ts:260](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L260)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  opMappingReverse

• **opMappingReverse**: *object*

*Defined in [constants.ts:261](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L261)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  primMapping

• **primMapping**: *object*

*Defined in [constants.ts:262](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L262)*

#### Type declaration:

* \[ **key**: *string*\]: string | object

###  primMappingReverse

• **primMappingReverse**: *object*

*Defined in [constants.ts:263](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L263)*

#### Type declaration:

* \[ **key**: *string*\]: object

* \[ **key**: *string*\]: undefined | string

___

### `Const` forgeOpTags

### ▪ **forgeOpTags**: *object*

*Defined in [constants.ts:212](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L212)*

▪ **004**: *object*

*Defined in [constants.ts:213](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L213)*

* **activate_account**: *number* = 4

* **ballot**: *number* = 6

* **delegation**: *number* = 10

* **double_baking_evidence**: *number* = 3

* **double_endorsement_evidence**: *number* = 2

* **endorsement**: *number* = 0

* **origination**: *number* = 9

* **proposals**: *number* = 5

* **reveal**: *number* = 7

* **seed_nonce_revelation**: *number* = 1

* **transaction**: *number* = 8

▪ **005**: *object*

*Defined in [constants.ts:226](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L226)*

* **activate_account**: *number* = 4

* **ballot**: *number* = 6

* **delegation**: *number* = 110

* **double_baking_evidence**: *number* = 3

* **double_endorsement_evidence**: *number* = 2

* **endorsement**: *number* = 0

* **origination**: *number* = 109

* **proposals**: *number* = 5

* **reveal**: *number* = 107

* **seed_nonce_revelation**: *number* = 1

* **transaction**: *number* = 108

___

### `Const` opMapping

### ▪ **opMapping**: *object*

*Defined in [constants.ts:46](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L46)*

###  00

• **00**: *string* = "parameter"

*Defined in [constants.ts:47](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L47)*

###  01

• **01**: *string* = "storage"

*Defined in [constants.ts:48](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L48)*

###  02

• **02**: *string* = "code"

*Defined in [constants.ts:49](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L49)*

###  03

• **03**: *string* = "False"

*Defined in [constants.ts:50](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L50)*

###  04

• **04**: *string* = "Elt"

*Defined in [constants.ts:51](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L51)*

###  05

• **05**: *string* = "Left"

*Defined in [constants.ts:52](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L52)*

###  06

• **06**: *string* = "None"

*Defined in [constants.ts:53](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L53)*

###  07

• **07**: *string* = "Pair"

*Defined in [constants.ts:54](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L54)*

###  08

• **08**: *string* = "Right"

*Defined in [constants.ts:55](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L55)*

###  09

• **09**: *string* = "Some"

*Defined in [constants.ts:56](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L56)*

###  0A

• **0A**: *string* = "True"

*Defined in [constants.ts:57](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L57)*

###  0B

• **0B**: *string* = "Unit"

*Defined in [constants.ts:58](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L58)*

###  0C

• **0C**: *string* = "PACK"

*Defined in [constants.ts:59](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L59)*

###  0D

• **0D**: *string* = "UNPACK"

*Defined in [constants.ts:60](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L60)*

###  0E

• **0E**: *string* = "BLAKE2B"

*Defined in [constants.ts:61](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L61)*

###  0F

• **0F**: *string* = "SHA256"

*Defined in [constants.ts:62](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L62)*

###  10

• **10**: *string* = "SHA512"

*Defined in [constants.ts:63](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L63)*

###  11

• **11**: *string* = "ABS"

*Defined in [constants.ts:64](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L64)*

###  12

• **12**: *string* = "ADD"

*Defined in [constants.ts:65](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L65)*

###  13

• **13**: *string* = "AMOUNT"

*Defined in [constants.ts:66](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L66)*

###  14

• **14**: *string* = "AND"

*Defined in [constants.ts:67](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L67)*

###  15

• **15**: *string* = "BALANCE"

*Defined in [constants.ts:68](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L68)*

###  16

• **16**: *string* = "CAR"

*Defined in [constants.ts:69](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L69)*

###  17

• **17**: *string* = "CDR"

*Defined in [constants.ts:70](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L70)*

###  18

• **18**: *string* = "CHECK_SIGNATURE"

*Defined in [constants.ts:71](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L71)*

###  19

• **19**: *string* = "COMPARE"

*Defined in [constants.ts:72](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L72)*

###  1A

• **1A**: *string* = "CONCAT"

*Defined in [constants.ts:73](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L73)*

###  1B

• **1B**: *string* = "CONS"

*Defined in [constants.ts:74](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L74)*

###  1C

• **1C**: *string* = "CREATE_ACCOUNT"

*Defined in [constants.ts:75](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L75)*

###  1D

• **1D**: *string* = "CREATE_CONTRACT"

*Defined in [constants.ts:76](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L76)*

###  1E

• **1E**: *string* = "IMPLICIT_ACCOUNT"

*Defined in [constants.ts:77](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L77)*

###  1F

• **1F**: *string* = "DIP"

*Defined in [constants.ts:78](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L78)*

###  20

• **20**: *string* = "DROP"

*Defined in [constants.ts:79](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L79)*

###  21

• **21**: *string* = "DUP"

*Defined in [constants.ts:80](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L80)*

###  22

• **22**: *string* = "EDIV"

*Defined in [constants.ts:81](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L81)*

###  23

• **23**: *string* = "EMPTY_MAP"

*Defined in [constants.ts:82](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L82)*

###  24

• **24**: *string* = "EMPTY_SET"

*Defined in [constants.ts:83](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L83)*

###  25

• **25**: *string* = "EQ"

*Defined in [constants.ts:84](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L84)*

###  26

• **26**: *string* = "EXEC"

*Defined in [constants.ts:85](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L85)*

###  27

• **27**: *string* = "FAILWITH"

*Defined in [constants.ts:86](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L86)*

###  28

• **28**: *string* = "GE"

*Defined in [constants.ts:87](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L87)*

###  29

• **29**: *string* = "GET"

*Defined in [constants.ts:88](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L88)*

###  2A

• **2A**: *string* = "GT"

*Defined in [constants.ts:89](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L89)*

###  2B

• **2B**: *string* = "HASH_KEY"

*Defined in [constants.ts:90](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L90)*

###  2C

• **2C**: *string* = "IF"

*Defined in [constants.ts:91](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L91)*

###  2D

• **2D**: *string* = "IF_CONS"

*Defined in [constants.ts:92](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L92)*

###  2E

• **2E**: *string* = "IF_LEFT"

*Defined in [constants.ts:93](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L93)*

###  2F

• **2F**: *string* = "IF_NONE"

*Defined in [constants.ts:94](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L94)*

###  30

• **30**: *string* = "INT"

*Defined in [constants.ts:95](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L95)*

###  31

• **31**: *string* = "LAMBDA"

*Defined in [constants.ts:96](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L96)*

###  32

• **32**: *string* = "LE"

*Defined in [constants.ts:97](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L97)*

###  33

• **33**: *string* = "LEFT"

*Defined in [constants.ts:98](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L98)*

###  34

• **34**: *string* = "LOOP"

*Defined in [constants.ts:99](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L99)*

###  35

• **35**: *string* = "LSL"

*Defined in [constants.ts:100](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L100)*

###  36

• **36**: *string* = "LSR"

*Defined in [constants.ts:101](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L101)*

###  37

• **37**: *string* = "LT"

*Defined in [constants.ts:102](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L102)*

###  38

• **38**: *string* = "MAP"

*Defined in [constants.ts:103](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L103)*

###  39

• **39**: *string* = "MEM"

*Defined in [constants.ts:104](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L104)*

###  3A

• **3A**: *string* = "MUL"

*Defined in [constants.ts:105](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L105)*

###  3B

• **3B**: *string* = "NEG"

*Defined in [constants.ts:106](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L106)*

###  3C

• **3C**: *string* = "NEQ"

*Defined in [constants.ts:107](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L107)*

###  3D

• **3D**: *string* = "NIL"

*Defined in [constants.ts:108](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L108)*

###  3E

• **3E**: *string* = "NONE"

*Defined in [constants.ts:109](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L109)*

###  3F

• **3F**: *string* = "NOT"

*Defined in [constants.ts:110](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L110)*

###  40

• **40**: *string* = "NOW"

*Defined in [constants.ts:111](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L111)*

###  41

• **41**: *string* = "OR"

*Defined in [constants.ts:112](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L112)*

###  42

• **42**: *string* = "PAIR"

*Defined in [constants.ts:113](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L113)*

###  43

• **43**: *string* = "PUSH"

*Defined in [constants.ts:114](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L114)*

###  44

• **44**: *string* = "RIGHT"

*Defined in [constants.ts:115](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L115)*

###  45

• **45**: *string* = "SIZE"

*Defined in [constants.ts:116](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L116)*

###  46

• **46**: *string* = "SOME"

*Defined in [constants.ts:117](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L117)*

###  47

• **47**: *string* = "SOURCE"

*Defined in [constants.ts:118](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L118)*

###  48

• **48**: *string* = "SENDER"

*Defined in [constants.ts:119](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L119)*

###  49

• **49**: *string* = "SELF"

*Defined in [constants.ts:120](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L120)*

###  4A

• **4A**: *string* = "STEPS_TO_QUOTA"

*Defined in [constants.ts:121](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L121)*

###  4B

• **4B**: *string* = "SUB"

*Defined in [constants.ts:122](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L122)*

###  4C

• **4C**: *string* = "SWAP"

*Defined in [constants.ts:123](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L123)*

###  4D

• **4D**: *string* = "TRANSFER_TOKENS"

*Defined in [constants.ts:124](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L124)*

###  4E

• **4E**: *string* = "SET_DELEGATE"

*Defined in [constants.ts:125](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L125)*

###  4F

• **4F**: *string* = "UNIT"

*Defined in [constants.ts:126](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L126)*

###  50

• **50**: *string* = "UPDATE"

*Defined in [constants.ts:127](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L127)*

###  51

• **51**: *string* = "XOR"

*Defined in [constants.ts:128](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L128)*

###  52

• **52**: *string* = "ITER"

*Defined in [constants.ts:129](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L129)*

###  53

• **53**: *string* = "LOOP_LEFT"

*Defined in [constants.ts:130](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L130)*

###  54

• **54**: *string* = "ADDRESS"

*Defined in [constants.ts:131](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L131)*

###  55

• **55**: *string* = "CONTRACT"

*Defined in [constants.ts:132](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L132)*

###  56

• **56**: *string* = "ISNAT"

*Defined in [constants.ts:133](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L133)*

###  57

• **57**: *string* = "CAST"

*Defined in [constants.ts:134](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L134)*

###  58

• **58**: *string* = "RENAME"

*Defined in [constants.ts:135](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L135)*

###  59

• **59**: *string* = "bool"

*Defined in [constants.ts:136](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L136)*

###  5A

• **5A**: *string* = "contract"

*Defined in [constants.ts:137](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L137)*

###  5B

• **5B**: *string* = "int"

*Defined in [constants.ts:138](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L138)*

###  5C

• **5C**: *string* = "key"

*Defined in [constants.ts:139](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L139)*

###  5D

• **5D**: *string* = "key_hash"

*Defined in [constants.ts:140](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L140)*

###  5E

• **5E**: *string* = "lambda"

*Defined in [constants.ts:141](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L141)*

###  5F

• **5F**: *string* = "list"

*Defined in [constants.ts:142](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L142)*

###  60

• **60**: *string* = "map"

*Defined in [constants.ts:143](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L143)*

###  61

• **61**: *string* = "big_map"

*Defined in [constants.ts:144](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L144)*

###  62

• **62**: *string* = "nat"

*Defined in [constants.ts:145](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L145)*

###  63

• **63**: *string* = "option"

*Defined in [constants.ts:146](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L146)*

###  64

• **64**: *string* = "or"

*Defined in [constants.ts:147](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L147)*

###  65

• **65**: *string* = "pair"

*Defined in [constants.ts:148](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L148)*

###  66

• **66**: *string* = "set"

*Defined in [constants.ts:149](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L149)*

###  67

• **67**: *string* = "signature"

*Defined in [constants.ts:150](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L150)*

###  68

• **68**: *string* = "string"

*Defined in [constants.ts:151](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L151)*

###  69

• **69**: *string* = "bytes"

*Defined in [constants.ts:152](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L152)*

###  6A

• **6A**: *string* = "mutez"

*Defined in [constants.ts:153](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L153)*

###  6B

• **6B**: *string* = "timestamp"

*Defined in [constants.ts:154](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L154)*

###  6C

• **6C**: *string* = "unit"

*Defined in [constants.ts:155](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L155)*

###  6D

• **6D**: *string* = "operation"

*Defined in [constants.ts:156](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L156)*

###  6E

• **6E**: *string* = "address"

*Defined in [constants.ts:157](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L157)*

###  6F

• **6F**: *string* = "SLICE"

*Defined in [constants.ts:159](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L159)*

###  70

• **70**: *string* = "DIG"

*Defined in [constants.ts:161](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L161)*

###  71

• **71**: *string* = "DUG"

*Defined in [constants.ts:162](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L162)*

###  72

• **72**: *string* = "EMPTY_BIG_MAP"

*Defined in [constants.ts:163](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L163)*

###  73

• **73**: *string* = "APPLY"

*Defined in [constants.ts:164](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L164)*

###  74

• **74**: *string* = "chain_id"

*Defined in [constants.ts:165](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L165)*

###  75

• **75**: *string* = "CHAIN_ID"

*Defined in [constants.ts:166](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L166)*

___

### `Const` prefix

### ▪ **prefix**: *object*

*Defined in [constants.ts:3](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L3)*

###  Co

• **Co**: *Uint8Array* =  new Uint8Array([79, 179])

*Defined in [constants.ts:32](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L32)*

###  KT

• **KT**: *Uint8Array* =  new Uint8Array([2, 90, 121])

*Defined in [constants.ts:7](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L7)*

###  LLo

• **LLo**: *Uint8Array* =  new Uint8Array([29, 159, 109])

*Defined in [constants.ts:30](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L30)*

###  Lo

• **Lo**: *Uint8Array* =  new Uint8Array([133, 233])

*Defined in [constants.ts:29](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L29)*

###  Net

• **Net**: *Uint8Array* =  new Uint8Array([87, 82, 0])

*Defined in [constants.ts:25](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L25)*

###  P

• **P**: *Uint8Array* =  new Uint8Array([2, 170])

*Defined in [constants.ts:31](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L31)*

###  TZ

• **TZ**: *Uint8Array* =  new Uint8Array([2, 90, 121])

*Defined in [constants.ts:36](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L36)*

###  b

• **b**: *Uint8Array* =  new Uint8Array([1, 52])

*Defined in [constants.ts:27](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L27)*

###  edesk

• **edesk**: *Uint8Array* =  new Uint8Array([7, 90, 60, 179, 41])

*Defined in [constants.ts:17](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L17)*

###  edpk

• **edpk**: *Uint8Array* =  new Uint8Array([13, 15, 37, 217])

*Defined in [constants.ts:9](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L9)*

###  edsig

• **edsig**: *Uint8Array* =  new Uint8Array([9, 245, 205, 134, 18])

*Defined in [constants.ts:20](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L20)*

###  edsk

• **edsk**: *Uint8Array* =  new Uint8Array([43, 246, 78, 7])

*Defined in [constants.ts:19](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L19)*

###  edsk2

• **edsk2**: *Uint8Array* =  new Uint8Array([13, 15, 58, 7])

*Defined in [constants.ts:10](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L10)*

###  id

• **id**: *Uint8Array* =  new Uint8Array([153, 103])

*Defined in [constants.ts:33](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L33)*

###  nce

• **nce**: *Uint8Array* =  new Uint8Array([69, 220, 169])

*Defined in [constants.ts:26](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L26)*

###  o

• **o**: *Uint8Array* =  new Uint8Array([5, 116])

*Defined in [constants.ts:28](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L28)*

###  p2pk

• **p2pk**: *Uint8Array* =  new Uint8Array([3, 178, 139, 127])

*Defined in [constants.ts:15](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L15)*

###  p2sig

• **p2sig**: *Uint8Array* =  new Uint8Array([54, 240, 44, 52])

*Defined in [constants.ts:22](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L22)*

###  p2sk

• **p2sk**: *Uint8Array* =  new Uint8Array([16, 81, 238, 189])

*Defined in [constants.ts:12](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L12)*

###  sig

• **sig**: *Uint8Array* =  new Uint8Array([4, 130, 43])

*Defined in [constants.ts:23](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L23)*

###  sppk

• **sppk**: *Uint8Array* =  new Uint8Array([3, 254, 226, 86])

*Defined in [constants.ts:14](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L14)*

###  spsig

• **spsig**: *Uint8Array* =  new Uint8Array([13, 115, 101, 19, 63])

*Defined in [constants.ts:21](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L21)*

###  spsk

• **spsk**: *Uint8Array* =  new Uint8Array([17, 162, 224, 201])

*Defined in [constants.ts:11](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L11)*

###  tz1

• **tz1**: *Uint8Array* =  new Uint8Array([6, 161, 159])

*Defined in [constants.ts:4](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L4)*

###  tz2

• **tz2**: *Uint8Array* =  new Uint8Array([6, 161, 161])

*Defined in [constants.ts:5](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L5)*

###  tz3

• **tz3**: *Uint8Array* =  new Uint8Array([6, 161, 164])

*Defined in [constants.ts:6](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L6)*

___

### `Const` primMapping

### ▪ **primMapping**: *object*

*Defined in [constants.ts:178](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L178)*

###  00

• **00**: *string* = "int"

*Defined in [constants.ts:179](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L179)*

###  01

• **01**: *string* = "string"

*Defined in [constants.ts:180](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L180)*

###  02

• **02**: *string* = "seq"

*Defined in [constants.ts:181](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L181)*

###  0A

• **0A**: *string* = "bytes"

*Defined in [constants.ts:189](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L189)*

▪ **03**: *object*

*Defined in [constants.ts:182](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L182)*

* **annots**: *false* = false

* **len**: *number* = 0

* **name**: *string* = "prim"

▪ **04**: *object*

*Defined in [constants.ts:183](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L183)*

* **annots**: *true* = true

* **len**: *number* = 0

* **name**: *string* = "prim"

▪ **05**: *object*

*Defined in [constants.ts:184](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L184)*

* **annots**: *false* = false

* **len**: *number* = 1

* **name**: *string* = "prim"

▪ **06**: *object*

*Defined in [constants.ts:185](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L185)*

* **annots**: *true* = true

* **len**: *number* = 1

* **name**: *string* = "prim"

▪ **07**: *object*

*Defined in [constants.ts:186](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L186)*

* **annots**: *false* = false

* **len**: *number* = 2

* **name**: *string* = "prim"

▪ **08**: *object*

*Defined in [constants.ts:187](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L187)*

* **annots**: *true* = true

* **len**: *number* = 2

* **name**: *string* = "prim"

▪ **09**: *object*

*Defined in [constants.ts:188](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L188)*

* **annots**: *true* = true

* **len**: *number* = 3

* **name**: *string* = "prim"

___

### `Const` primMappingReverse

### ▪ **primMappingReverse**: *object*

*Defined in [constants.ts:193](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L193)*

▪ **0**: *object*

*Defined in [constants.ts:194](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L194)*

* **false**: *string* = "03"

* **true**: *string* = "04"

▪ **1**: *object*

*Defined in [constants.ts:198](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L198)*

* **false**: *string* = "05"

* **true**: *string* = "06"

▪ **2**: *object*

*Defined in [constants.ts:202](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L202)*

* **false**: *string* = "07"

* **true**: *string* = "08"

▪ **3**: *object*

*Defined in [constants.ts:206](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L206)*

* **true**: *string* = "09"

___

### `Const` protocols

### ▪ **protocols**: *object*

*Defined in [constants.ts:269](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L269)*

###  004

• **004**: *string* = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd"

*Defined in [constants.ts:270](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L270)*

###  005

• **005**: *string* = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU"

*Defined in [constants.ts:271](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L271)*

___

### `Const` watermark

### ▪ **watermark**: *object*

*Defined in [constants.ts:39](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L39)*

###  block

• **block**: *Uint8Array* =  new Uint8Array([1])

*Defined in [constants.ts:40](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L40)*

###  endorsement

• **endorsement**: *Uint8Array* =  new Uint8Array([2])

*Defined in [constants.ts:41](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L41)*

###  generic

• **generic**: *Uint8Array* =  new Uint8Array([3])

*Defined in [constants.ts:42](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/constants.ts#L42)*