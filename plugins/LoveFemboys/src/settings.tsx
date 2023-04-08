import { Forms, General } from "@vendetta/ui/components";
import { storage } from '@vendetta/plugin';
import { useProxy } from '@vendetta/storage';
import { getAssetIDByName } from "@vendetta/ui/assets";

const { ScrollView } = General;

const { FormSwitchRow, FormIcon } = Forms;

export default () => {
    useProxy(storage);


    return (
        <ScrollView>
        <FormSwitchRow
            label="NSFW Warning"
            subLabel="Warn when sending an NSFW image in a non NSFW channel."
            leading={<FormIcon source={getAssetIDByName("ic_warning_24px")} />}
            value={storage.nsfwwarn}
            onValueChange={(value: boolean) => storage.nsfwwarn = value}
        />
    </ScrollView>
    )

    
}
