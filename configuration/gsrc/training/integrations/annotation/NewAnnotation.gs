package training.integrations.annotation

uses gw.lang.annotation.UsageTarget
uses gw.lang.annotation.AnnotationUsage
uses gw.lang.annotation.UsageModifier

/**
 * UsageTarget - What code element can this annotation be used with?
 * Values can be : AllTarget, TypeTarget, ConstructorTarget, PropertyTarget, MethodTarget, ParameterTarget
 *
 * UsageModifier - How many times can the annotation be used per target?
 * Values can be : None, One, Many
 */
@AnnotationUsage(UsageTarget.MethodTarget, UsageModifier.Many)
class NewAnnotation implements IAnnotation {


    /**
     * annotation with paramters
     * @param val1
     * @param val2
     */
    construct(val1 : String, val2 : String) {

    }

    /**
     * Annotation without parameters
     */
    construct() {

    }

    private function abc(){
        //some impl here
    }

}