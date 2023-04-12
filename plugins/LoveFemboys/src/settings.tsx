import { Forms, General } from "@vendetta/ui/components";
import { storage } from '@vendetta/plugin';
import { useProxy } from '@vendetta/storage';
import { getAssetIDByName } from "@vendetta/ui/assets";

const { ScrollView } = General;
const { FormSection, FormRadioRow, FormSwitchRow, FormIcon  } = Forms;


export default () => {
    useProxy(storage);
    return (
        <ScrollView>
        <FormSection title="Misc Settings" titleStyleType="no_border"></FormSection>
        <FormSwitchRow
            label="NSFW Warning"
            subLabel="Warn when sending an NSFW image in a non NSFW channel."
            leading={<FormIcon source={getAssetIDByName("ic_warning_24px")} />}
            value={storage.nsfwwarn}
            onValueChange={(value: boolean) => storage.nsfwwarn = value}
        />
            <FormSection title="Defalt Sort" titleStyleType="no_border">
                {Object.entries({Best: "best", Hot: "hot", New: "new", Rising: "rising", Top: "top", Controversial: "controversial",}).map(([name, sort]) => <FormRadioRow
                    label={name}
                    selected={storage.sortdefs === sort}
                    onPress={() => {
                        storage.sortdefs = sort;
                    }}
                />)}
            </FormSection>
    </ScrollView>
    )

    
}
