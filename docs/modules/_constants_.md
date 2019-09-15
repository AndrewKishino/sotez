[Sotez Documentation](../README.md) › ["constants"](_constants_.md)

# External module: "constants"


## Index

### Interfaces

* [Prefix](../interfaces/_constants_.prefix.md)
* [Watermark](../interfaces/_constants_.watermark.md)

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

*Defined in [constants.ts:291](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L291)*

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

*Defined in [constants.ts:210](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L210)*

#### Type declaration:

* \[ **key**: *string*\]: string

## Object literals

### `Const` entrypointMapping

### ▪ **entrypointMapping**: *object*

*Defined in [constants.ts:282](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L282)*

###  00

• **00**: *string* = "default"

*Defined in [constants.ts:283](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L283)*

###  01

• **01**: *string* = "root"

*Defined in [constants.ts:284](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L284)*

###  02

• **02**: *string* = "do"

*Defined in [constants.ts:285](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L285)*

###  03

• **03**: *string* = "set_delegate"

*Defined in [constants.ts:286](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L286)*

###  04

• **04**: *string* = "remove_delegate"

*Defined in [constants.ts:287](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L287)*

___

### `Const` forgeMappings

### ▪ **forgeMappings**: *object*

*Defined in [constants.ts:299](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L299)*

###  entrypointMapping

• **entrypointMapping**: *object*

*Defined in [constants.ts:305](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L305)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  entrypointMappingReverse

• **entrypointMappingReverse**: *object*

*Defined in [constants.ts:306](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L306)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  forgeOpTags

• **forgeOpTags**: *object*

*Defined in [constants.ts:304](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L304)*

#### Type declaration:

* \[ **key**: *string*\]: object

* \[ **key**: *string*\]: number

###  opMapping

• **opMapping**: *object*

*Defined in [constants.ts:300](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L300)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  opMappingReverse

• **opMappingReverse**: *object*

*Defined in [constants.ts:301](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L301)*

#### Type declaration:

* \[ **key**: *string*\]: string

###  primMapping

• **primMapping**: *object*

*Defined in [constants.ts:302](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L302)*

#### Type declaration:

* \[ **key**: *string*\]: string | object

###  primMappingReverse

• **primMappingReverse**: *object*

*Defined in [constants.ts:303](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L303)*

#### Type declaration:

* \[ **key**: *string*\]: object

* \[ **key**: *string*\]: string

___

### `Const` forgeOpTags

### ▪ **forgeOpTags**: *object*

*Defined in [constants.ts:252](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L252)*

▪ **004**: *object*

*Defined in [constants.ts:253](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L253)*

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

*Defined in [constants.ts:266](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L266)*

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

*Defined in [constants.ts:86](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L86)*

###  00

• **00**: *string* = "parameter"

*Defined in [constants.ts:87](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L87)*

###  01

• **01**: *string* = "storage"

*Defined in [constants.ts:88](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L88)*

###  02

• **02**: *string* = "code"

*Defined in [constants.ts:89](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L89)*

###  03

• **03**: *string* = "False"

*Defined in [constants.ts:90](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L90)*

###  04

• **04**: *string* = "Elt"

*Defined in [constants.ts:91](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L91)*

###  05

• **05**: *string* = "Left"

*Defined in [constants.ts:92](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L92)*

###  06

• **06**: *string* = "None"

*Defined in [constants.ts:93](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L93)*

###  07

• **07**: *string* = "Pair"

*Defined in [constants.ts:94](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L94)*

###  08

• **08**: *string* = "Right"

*Defined in [constants.ts:95](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L95)*

###  09

• **09**: *string* = "Some"

*Defined in [constants.ts:96](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L96)*

###  0A

• **0A**: *string* = "True"

*Defined in [constants.ts:97](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L97)*

###  0B

• **0B**: *string* = "Unit"

*Defined in [constants.ts:98](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L98)*

###  0C

• **0C**: *string* = "PACK"

*Defined in [constants.ts:99](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L99)*

###  0D

• **0D**: *string* = "UNPACK"

*Defined in [constants.ts:100](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L100)*

###  0E

• **0E**: *string* = "BLAKE2B"

*Defined in [constants.ts:101](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L101)*

###  0F

• **0F**: *string* = "SHA256"

*Defined in [constants.ts:102](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L102)*

###  10

• **10**: *string* = "SHA512"

*Defined in [constants.ts:103](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L103)*

###  11

• **11**: *string* = "ABS"

*Defined in [constants.ts:104](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L104)*

###  12

• **12**: *string* = "ADD"

*Defined in [constants.ts:105](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L105)*

###  13

• **13**: *string* = "AMOUNT"

*Defined in [constants.ts:106](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L106)*

###  14

• **14**: *string* = "AND"

*Defined in [constants.ts:107](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L107)*

###  15

• **15**: *string* = "BALANCE"

*Defined in [constants.ts:108](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L108)*

###  16

• **16**: *string* = "CAR"

*Defined in [constants.ts:109](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L109)*

###  17

• **17**: *string* = "CDR"

*Defined in [constants.ts:110](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L110)*

###  18

• **18**: *string* = "CHECK_SIGNATURE"

*Defined in [constants.ts:111](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L111)*

###  19

• **19**: *string* = "COMPARE"

*Defined in [constants.ts:112](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L112)*

###  1A

• **1A**: *string* = "CONCAT"

*Defined in [constants.ts:113](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L113)*

###  1B

• **1B**: *string* = "CONS"

*Defined in [constants.ts:114](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L114)*

###  1C

• **1C**: *string* = "CREATE_ACCOUNT"

*Defined in [constants.ts:115](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L115)*

###  1D

• **1D**: *string* = "CREATE_CONTRACT"

*Defined in [constants.ts:116](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L116)*

###  1E

• **1E**: *string* = "IMPLICIT_ACCOUNT"

*Defined in [constants.ts:117](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L117)*

###  1F

• **1F**: *string* = "DIP"

*Defined in [constants.ts:118](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L118)*

###  20

• **20**: *string* = "DROP"

*Defined in [constants.ts:119](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L119)*

###  21

• **21**: *string* = "DUP"

*Defined in [constants.ts:120](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L120)*

###  22

• **22**: *string* = "EDIV"

*Defined in [constants.ts:121](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L121)*

###  23

• **23**: *string* = "EMPTY_MAP"

*Defined in [constants.ts:122](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L122)*

###  24

• **24**: *string* = "EMPTY_SET"

*Defined in [constants.ts:123](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L123)*

###  25

• **25**: *string* = "EQ"

*Defined in [constants.ts:124](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L124)*

###  26

• **26**: *string* = "EXEC"

*Defined in [constants.ts:125](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L125)*

###  27

• **27**: *string* = "FAILWITH"

*Defined in [constants.ts:126](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L126)*

###  28

• **28**: *string* = "GE"

*Defined in [constants.ts:127](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L127)*

###  29

• **29**: *string* = "GET"

*Defined in [constants.ts:128](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L128)*

###  2A

• **2A**: *string* = "GT"

*Defined in [constants.ts:129](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L129)*

###  2B

• **2B**: *string* = "HASH_KEY"

*Defined in [constants.ts:130](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L130)*

###  2C

• **2C**: *string* = "IF"

*Defined in [constants.ts:131](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L131)*

###  2D

• **2D**: *string* = "IF_CONS"

*Defined in [constants.ts:132](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L132)*

###  2E

• **2E**: *string* = "IF_LEFT"

*Defined in [constants.ts:133](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L133)*

###  2F

• **2F**: *string* = "IF_NONE"

*Defined in [constants.ts:134](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L134)*

###  30

• **30**: *string* = "INT"

*Defined in [constants.ts:135](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L135)*

###  31

• **31**: *string* = "LAMBDA"

*Defined in [constants.ts:136](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L136)*

###  32

• **32**: *string* = "LE"

*Defined in [constants.ts:137](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L137)*

###  33

• **33**: *string* = "LEFT"

*Defined in [constants.ts:138](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L138)*

###  34

• **34**: *string* = "LOOP"

*Defined in [constants.ts:139](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L139)*

###  35

• **35**: *string* = "LSL"

*Defined in [constants.ts:140](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L140)*

###  36

• **36**: *string* = "LSR"

*Defined in [constants.ts:141](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L141)*

###  37

• **37**: *string* = "LT"

*Defined in [constants.ts:142](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L142)*

###  38

• **38**: *string* = "MAP"

*Defined in [constants.ts:143](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L143)*

###  39

• **39**: *string* = "MEM"

*Defined in [constants.ts:144](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L144)*

###  3A

• **3A**: *string* = "MUL"

*Defined in [constants.ts:145](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L145)*

###  3B

• **3B**: *string* = "NEG"

*Defined in [constants.ts:146](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L146)*

###  3C

• **3C**: *string* = "NEQ"

*Defined in [constants.ts:147](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L147)*

###  3D

• **3D**: *string* = "NIL"

*Defined in [constants.ts:148](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L148)*

###  3E

• **3E**: *string* = "NONE"

*Defined in [constants.ts:149](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L149)*

###  3F

• **3F**: *string* = "NOT"

*Defined in [constants.ts:150](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L150)*

###  40

• **40**: *string* = "NOW"

*Defined in [constants.ts:151](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L151)*

###  41

• **41**: *string* = "OR"

*Defined in [constants.ts:152](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L152)*

###  42

• **42**: *string* = "PAIR"

*Defined in [constants.ts:153](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L153)*

###  43

• **43**: *string* = "PUSH"

*Defined in [constants.ts:154](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L154)*

###  44

• **44**: *string* = "RIGHT"

*Defined in [constants.ts:155](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L155)*

###  45

• **45**: *string* = "SIZE"

*Defined in [constants.ts:156](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L156)*

###  46

• **46**: *string* = "SOME"

*Defined in [constants.ts:157](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L157)*

###  47

• **47**: *string* = "SOURCE"

*Defined in [constants.ts:158](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L158)*

###  48

• **48**: *string* = "SENDER"

*Defined in [constants.ts:159](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L159)*

###  49

• **49**: *string* = "SELF"

*Defined in [constants.ts:160](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L160)*

###  4A

• **4A**: *string* = "STEPS_TO_QUOTA"

*Defined in [constants.ts:161](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L161)*

###  4B

• **4B**: *string* = "SUB"

*Defined in [constants.ts:162](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L162)*

###  4C

• **4C**: *string* = "SWAP"

*Defined in [constants.ts:163](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L163)*

###  4D

• **4D**: *string* = "TRANSFER_TOKENS"

*Defined in [constants.ts:164](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L164)*

###  4E

• **4E**: *string* = "SET_DELEGATE"

*Defined in [constants.ts:165](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L165)*

###  4F

• **4F**: *string* = "UNIT"

*Defined in [constants.ts:166](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L166)*

###  50

• **50**: *string* = "UPDATE"

*Defined in [constants.ts:167](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L167)*

###  51

• **51**: *string* = "XOR"

*Defined in [constants.ts:168](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L168)*

###  52

• **52**: *string* = "ITER"

*Defined in [constants.ts:169](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L169)*

###  53

• **53**: *string* = "LOOP_LEFT"

*Defined in [constants.ts:170](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L170)*

###  54

• **54**: *string* = "ADDRESS"

*Defined in [constants.ts:171](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L171)*

###  55

• **55**: *string* = "CONTRACT"

*Defined in [constants.ts:172](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L172)*

###  56

• **56**: *string* = "ISNAT"

*Defined in [constants.ts:173](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L173)*

###  57

• **57**: *string* = "CAST"

*Defined in [constants.ts:174](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L174)*

###  58

• **58**: *string* = "RENAME"

*Defined in [constants.ts:175](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L175)*

###  59

• **59**: *string* = "bool"

*Defined in [constants.ts:176](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L176)*

###  5A

• **5A**: *string* = "contract"

*Defined in [constants.ts:177](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L177)*

###  5B

• **5B**: *string* = "int"

*Defined in [constants.ts:178](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L178)*

###  5C

• **5C**: *string* = "key"

*Defined in [constants.ts:179](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L179)*

###  5D

• **5D**: *string* = "key_hash"

*Defined in [constants.ts:180](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L180)*

###  5E

• **5E**: *string* = "lambda"

*Defined in [constants.ts:181](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L181)*

###  5F

• **5F**: *string* = "list"

*Defined in [constants.ts:182](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L182)*

###  60

• **60**: *string* = "map"

*Defined in [constants.ts:183](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L183)*

###  61

• **61**: *string* = "big_map"

*Defined in [constants.ts:184](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L184)*

###  62

• **62**: *string* = "nat"

*Defined in [constants.ts:185](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L185)*

###  63

• **63**: *string* = "option"

*Defined in [constants.ts:186](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L186)*

###  64

• **64**: *string* = "or"

*Defined in [constants.ts:187](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L187)*

###  65

• **65**: *string* = "pair"

*Defined in [constants.ts:188](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L188)*

###  66

• **66**: *string* = "set"

*Defined in [constants.ts:189](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L189)*

###  67

• **67**: *string* = "signature"

*Defined in [constants.ts:190](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L190)*

###  68

• **68**: *string* = "string"

*Defined in [constants.ts:191](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L191)*

###  69

• **69**: *string* = "bytes"

*Defined in [constants.ts:192](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L192)*

###  6A

• **6A**: *string* = "mutez"

*Defined in [constants.ts:193](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L193)*

###  6B

• **6B**: *string* = "timestamp"

*Defined in [constants.ts:194](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L194)*

###  6C

• **6C**: *string* = "unit"

*Defined in [constants.ts:195](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L195)*

###  6D

• **6D**: *string* = "operation"

*Defined in [constants.ts:196](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L196)*

###  6E

• **6E**: *string* = "address"

*Defined in [constants.ts:197](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L197)*

###  6F

• **6F**: *string* = "SLICE"

*Defined in [constants.ts:199](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L199)*

###  70

• **70**: *string* = "DIG"

*Defined in [constants.ts:201](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L201)*

###  71

• **71**: *string* = "DUG"

*Defined in [constants.ts:202](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L202)*

###  72

• **72**: *string* = "EMPTY_BIG_MAP"

*Defined in [constants.ts:203](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L203)*

###  73

• **73**: *string* = "APPLY"

*Defined in [constants.ts:204](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L204)*

###  74

• **74**: *string* = "chain_id"

*Defined in [constants.ts:205](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L205)*

###  75

• **75**: *string* = "CHAIN_ID"

*Defined in [constants.ts:206](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L206)*

___

### `Const` prefix

### ▪ **prefix**: *object*

*Defined in [constants.ts:43](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L43)*

###  Co

• **Co**: *Uint8Array* =  new Uint8Array([79, 179])

*Defined in [constants.ts:72](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L72)*

###  KT

• **KT**: *Uint8Array* =  new Uint8Array([2, 90, 121])

*Defined in [constants.ts:47](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L47)*

###  LLo

• **LLo**: *Uint8Array* =  new Uint8Array([29, 159, 109])

*Defined in [constants.ts:70](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L70)*

###  Lo

• **Lo**: *Uint8Array* =  new Uint8Array([133, 233])

*Defined in [constants.ts:69](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L69)*

###  Net

• **Net**: *Uint8Array* =  new Uint8Array([87, 82, 0])

*Defined in [constants.ts:65](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L65)*

###  P

• **P**: *Uint8Array* =  new Uint8Array([2, 170])

*Defined in [constants.ts:71](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L71)*

###  TZ

• **TZ**: *Uint8Array* =  new Uint8Array([2, 90, 121])

*Defined in [constants.ts:76](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L76)*

###  b

• **b**: *Uint8Array* =  new Uint8Array([1, 52])

*Defined in [constants.ts:67](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L67)*

###  edesk

• **edesk**: *Uint8Array* =  new Uint8Array([7, 90, 60, 179, 41])

*Defined in [constants.ts:57](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L57)*

###  edpk

• **edpk**: *Uint8Array* =  new Uint8Array([13, 15, 37, 217])

*Defined in [constants.ts:49](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L49)*

###  edsig

• **edsig**: *Uint8Array* =  new Uint8Array([9, 245, 205, 134, 18])

*Defined in [constants.ts:60](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L60)*

###  edsk

• **edsk**: *Uint8Array* =  new Uint8Array([43, 246, 78, 7])

*Defined in [constants.ts:59](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L59)*

###  edsk2

• **edsk2**: *Uint8Array* =  new Uint8Array([13, 15, 58, 7])

*Defined in [constants.ts:50](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L50)*

###  id

• **id**: *Uint8Array* =  new Uint8Array([153, 103])

*Defined in [constants.ts:73](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L73)*

###  nce

• **nce**: *Uint8Array* =  new Uint8Array([69, 220, 169])

*Defined in [constants.ts:66](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L66)*

###  o

• **o**: *Uint8Array* =  new Uint8Array([5, 116])

*Defined in [constants.ts:68](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L68)*

###  p2pk

• **p2pk**: *Uint8Array* =  new Uint8Array([3, 178, 139, 127])

*Defined in [constants.ts:55](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L55)*

###  p2sig

• **p2sig**: *Uint8Array* =  new Uint8Array([54, 240, 44, 52])

*Defined in [constants.ts:62](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L62)*

###  p2sk

• **p2sk**: *Uint8Array* =  new Uint8Array([16, 81, 238, 189])

*Defined in [constants.ts:52](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L52)*

###  sig

• **sig**: *Uint8Array* =  new Uint8Array([4, 130, 43])

*Defined in [constants.ts:63](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L63)*

###  sppk

• **sppk**: *Uint8Array* =  new Uint8Array([3, 254, 226, 86])

*Defined in [constants.ts:54](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L54)*

###  spsig

• **spsig**: *Uint8Array* =  new Uint8Array([13, 115, 101, 19, 63])

*Defined in [constants.ts:61](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L61)*

###  spsk

• **spsk**: *Uint8Array* =  new Uint8Array([17, 162, 224, 201])

*Defined in [constants.ts:51](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L51)*

###  tz1

• **tz1**: *Uint8Array* =  new Uint8Array([6, 161, 159])

*Defined in [constants.ts:44](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L44)*

###  tz2

• **tz2**: *Uint8Array* =  new Uint8Array([6, 161, 161])

*Defined in [constants.ts:45](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L45)*

###  tz3

• **tz3**: *Uint8Array* =  new Uint8Array([6, 161, 164])

*Defined in [constants.ts:46](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L46)*

___

### `Const` primMapping

### ▪ **primMapping**: *object*

*Defined in [constants.ts:218](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L218)*

###  00

• **00**: *string* = "int"

*Defined in [constants.ts:219](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L219)*

###  01

• **01**: *string* = "string"

*Defined in [constants.ts:220](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L220)*

###  02

• **02**: *string* = "seq"

*Defined in [constants.ts:221](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L221)*

###  0A

• **0A**: *string* = "bytes"

*Defined in [constants.ts:229](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L229)*

▪ **03**: *object*

*Defined in [constants.ts:222](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L222)*

* **annots**: *false* = false

* **len**: *number* = 0

* **name**: *string* = "prim"

▪ **04**: *object*

*Defined in [constants.ts:223](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L223)*

* **annots**: *true* = true

* **len**: *number* = 0

* **name**: *string* = "prim"

▪ **05**: *object*

*Defined in [constants.ts:224](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L224)*

* **annots**: *false* = false

* **len**: *number* = 1

* **name**: *string* = "prim"

▪ **06**: *object*

*Defined in [constants.ts:225](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L225)*

* **annots**: *true* = true

* **len**: *number* = 1

* **name**: *string* = "prim"

▪ **07**: *object*

*Defined in [constants.ts:226](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L226)*

* **annots**: *false* = false

* **len**: *number* = 2

* **name**: *string* = "prim"

▪ **08**: *object*

*Defined in [constants.ts:227](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L227)*

* **annots**: *true* = true

* **len**: *number* = 2

* **name**: *string* = "prim"

▪ **09**: *object*

*Defined in [constants.ts:228](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L228)*

* **annots**: *true* = true

* **len**: *number* = 3

* **name**: *string* = "prim"

___

### `Const` primMappingReverse

### ▪ **primMappingReverse**: *object*

*Defined in [constants.ts:233](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L233)*

▪ **0**: *object*

*Defined in [constants.ts:234](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L234)*

* **false**: *string* = "03"

* **true**: *string* = "04"

▪ **1**: *object*

*Defined in [constants.ts:238](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L238)*

* **false**: *string* = "05"

* **true**: *string* = "06"

▪ **2**: *object*

*Defined in [constants.ts:242](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L242)*

* **false**: *string* = "07"

* **true**: *string* = "08"

▪ **3**: *object*

*Defined in [constants.ts:246](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L246)*

* **true**: *string* = "09"

___

### `Const` protocols

### ▪ **protocols**: *object*

*Defined in [constants.ts:309](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L309)*

###  004

• **004**: *string* = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd"

*Defined in [constants.ts:310](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L310)*

###  005

• **005**: *string* = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU"

*Defined in [constants.ts:311](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L311)*

___

### `Const` watermark

### ▪ **watermark**: *object*

*Defined in [constants.ts:79](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L79)*

###  block

• **block**: *Uint8Array* =  new Uint8Array([1])

*Defined in [constants.ts:80](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L80)*

###  endorsement

• **endorsement**: *Uint8Array* =  new Uint8Array([2])

*Defined in [constants.ts:81](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L81)*

###  generic

• **generic**: *Uint8Array* =  new Uint8Array([3])

*Defined in [constants.ts:82](https://github.com/KZen-networks/sotez/blob/80ad203/src/constants.ts#L82)*