package org.samo_lego.taterzens.mixin.accessors;

import net.minecraft.network.protocol.game.ClientboundPlayerInfoUpdatePacket;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Mutable;
import org.spongepowered.asm.mixin.gen.Accessor;

import java.util.List;

@Mixin(ClientboundPlayerInfoUpdatePacket.class)
public interface ClientboundPlayerInfoPacketAccessor {
    @Mutable
    @Accessor("entries")
    void setEntries(List<ClientboundPlayerInfoUpdatePacket.Entry> entries);
}
